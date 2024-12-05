import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import {
  validationMessageGroup,
  validationMessageServer,
} from '../../common/constants/index';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import Group from './entities/group.entity';
import { FilterGroupDto, ResponseGroupTableDto } from './dto/filter-group.dto';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from '../../core/errors/all-exceptions.filter';
import GroupPermission from '../../database/entitysExternals/groupPermission.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupPermission)
    private readonly groupPermissionRepository: Repository<GroupPermission>,
  ) { }

  //--------------------------

  @UseFilters(AllExceptionsFilter)
  async create(data: CreateGroupDto): Promise<Group | AllResponseFilter> {
    const queryRunner =
      this.groupRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar si ya existe un group activo con el mismo nombre
      const existingActiveGroup = await this.groupRepository.findOne({
        where: { description: data.description, is_deleted: false },
      });

      if (existingActiveGroup) {
        throw new ConflictException(
          validationMessageGroup.CONFLICT.GROUP,
        );
      }

      // Crear nuevo group
      const newGroup = this.groupRepository.create({
        description: data.description,
        is_deleted: false, // Nuevo group activo
      });

      await queryRunner.manager.save(newGroup);

      const permissionProfilesResults = await Promise.allSettled(
        data.groupPermission.map(async (element) => {
          // Intentar encontrar el permiso por ID


          // Crear la relación de group-permiso si el permiso existe
          return this.groupPermissionRepository.create({
            group_id: newGroup.id,
            create: element.create,
            read: element.read,
            update: element.update,
            delete: element.delete,
          });
        }),
      );

      const permissionProfiles = permissionProfilesResults
        .filter((result) => result.status === 'fulfilled')
        .map(
          (result) => (result as PromiseFulfilledResult<GroupPermission>).value,
        );

      await queryRunner.manager.save(permissionProfiles);

      await queryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.CREATED,
        message: validationMessageGroup.OK.CREATED,
        timestamp: new Date().toISOString(),
        path: `/api/v1/group`,
        data: newGroup,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error; // Deja pasar las excepciones personalizadas
      }

      throw new InternalServerErrorException(error);
    }
  }

  //--------------------------

  @UseFilters(AllExceptionsFilter)
  async findTable(query: FilterGroupDto): Promise<ResponseGroupTableDto> {
    let take = Number(query.take);
    const page = Number(query.page) || 0;

    take = Math.max(0, take || 5); // Asegurar que take sea al menos 0
    const skip = page * take;

    let where: FindOptionsWhere<Group> = {
      is_deleted: false,
    };

    if (query.description) {
      where = {
        description: ILike(`%${query.description}%`),
      };
    }

    const [data, totalData] = await this.groupRepository.findAndCount({
      where,
      relations: {
        groupPermission: true,
      },
      take,
      skip,
      order: { id: 'ASC' },
    });
    const totalPages = Math.ceil(totalData / take);

    if (data.length === 0) {
      throw new NotFoundException(validationMessageGroup.NOT_CONTENT.GROUPS);
    }

    return { data, totalData, totalPages, currentPage: page };
  }

  @UseFilters(AllExceptionsFilter)
  async findOne(id: number): Promise<Group | AllResponseFilter> {
    const group = await this.groupRepository.findOne({ where: { id } });

    if (!group) {
      throw new NotFoundException(validationMessageGroup.NOT_CONTENT.GROUP);
    }

    return {
      statusCode: HttpStatus.OK,
      message: validationMessageGroup.OK.CONTENT,
      timestamp: new Date().toISOString(),
      path: `/api/v1/group/${id}`,
      data: group,
    };
  }

  @UseFilters(AllExceptionsFilter)
  async update(
    id: number,
    data: UpdateGroupDto,
  ): Promise<Group | AllResponseFilter> {
    const queryRunner = this.groupRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar si hay otro grupo con el mismo nombre excluyendo el actual
      const existingGroup = await this.groupRepository.findOne({
        where: {
          description: data.description,
          is_deleted: false,
          id: Not(id), // Excluir el grupo actual del chequeo
        },
      });

      if (existingGroup) {
        throw new ConflictException(validationMessageGroup.CONFLICT.GROUP);
      }

      // Actualizar el grupo sin tocar las relaciones one-to-many (groupPermission)
      const verifyUpdate = await queryRunner.manager.update(Group, id, {
        ...data,
        groupPermission: undefined, // Excluimos la relación de la actualización
      });

      // Manejo de la relación one-to-many (groupPermission)
      if (data.groupPermission) {
        // Obtener los permisos actuales para este grupo
        const currentPermissions = await queryRunner.manager.find(GroupPermission, {
          where: { group_id: id },
        });

        // Generar un array con los nuevos permisos (con solo los campos necesarios)
        const newGroupPermissions = data.groupPermission.map((perm) => ({
          ...perm,
          group_id: id, // Aseguramos que el grupo esté relacionado con el ID correcto
        }));

        // Identificar permisos que deben eliminarse
        const permissionsToDelete = currentPermissions.filter(
          (perm) => !newGroupPermissions.some((newPerm) => newPerm.group_id === perm.group_id),
        );

        // Eliminar permisos antiguos no incluidos en los nuevos datos
        for (const permission of permissionsToDelete) {
          await queryRunner.manager.delete(GroupPermission, { id: permission.id });
        }

        // Insertar nuevos permisos o actualizar los existentes
        for (const newPermission of newGroupPermissions) {
          const existingPermission = currentPermissions.find(
            (perm) => perm.id === newPermission.group_id,
          );

          if (existingPermission) {
            // Si el permiso ya existe, actualizamos los campos necesarios
            await queryRunner.manager.update(GroupPermission, existingPermission.id, {
              create: newPermission.create,
              read: newPermission.read,
              update: newPermission.update,
              delete: newPermission.delete,
            });
          } else {
            // Si el permiso no existe, insertarlo
            await queryRunner.manager.insert(GroupPermission, newPermission);
          }
        }
      }

      // Verificar si hubo modificaciones
      if (verifyUpdate.affected >= 1) {
        await queryRunner.commitTransaction(); // Confirmar la transacción
        const group = await this.groupRepository.findOne({ where: { id } });
        return {
          statusCode: HttpStatus.OK,
          message: validationMessageGroup.OK.UPDATE,
          timestamp: new Date().toISOString(),
          path: `/api/v1/group/${id}`,
          data: group,
        };
      }

      // Si no hubo modificaciones
      await queryRunner.rollbackTransaction(); // Revertir en caso de no modificación
      return {
        statusCode: HttpStatus.NOT_MODIFIED,
        message: validationMessageGroup.NOT_OK.UPDATE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/group/${id}`,
        data: null,
      };
    } catch (error) {
      console.log(error);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    } finally {
      // Liberar el queryRunner siempre, independientemente de si la transacción fue exitosa o no
      await queryRunner.release();
    }
  }

  @UseFilters(AllExceptionsFilter)
  async delete(id: number): Promise<Group | AllResponseFilter> {
    const existingGroup = await this.groupRepository.findOneBy({ id });

    if (!existingGroup) {
      throw new NotFoundException(validationMessageGroup.NOT_CONTENT.GROUP);
    }

    // Verificar si el grupo ya está marcado como eliminado
    if (existingGroup.is_deleted) {
      throw new NotFoundException(
        validationMessageGroup.NOT_OK.DENIED,
      );
    }

    const is_deleted = !existingGroup.is_deleted;
    const updateIsDelete = await this.groupRepository.update(id, {
      is_deleted: is_deleted,
    });

    if (updateIsDelete.affected >= 1) {
      const profile = await this.groupRepository.findOneBy({ id });

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageGroup.OK.DELETE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/group/${id}`,
        data: profile,
      };
    }

    return {
      statusCode: HttpStatus.NOT_MODIFIED,
      message: validationMessageGroup.NOT_OK.DELETE,
      timestamp: new Date().toISOString(),
      path: `/api/v1/group/${id}`,
      data: null,
    };
  }

  async findByUserId(user_id: number): Promise<Group> {
    return this.groupRepository.findOne({
      where: { users: { id: user_id } },
      relations: ['permissions', 'modules'], // Asegúrate de cargar las relaciones
    });
  }

  async findProfileWithRelations(user_id: number): Promise<Group> {
    return this.groupRepository.findOne({
      where: { users: { id: user_id } },
      relations: ['groupClass.permissions', 'profilesModules.modules'],
    });
  }
}
