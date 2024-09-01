import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { validationMessagePermissions } from '../common/constants/index';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import Permissions from './entities/permissions.entity';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from 'src/core/errors/all-exceptions.filter';
import {
  FilterPermissionDto,
  ResponsePermissionTableDto,
} from './dto/filter-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
  ) {}

  @UseFilters(AllExceptionsFilter)
  async create(data: CreatePermissionDto): Promise<AllResponseFilter> {
    const existingPermission = await this.permissionRepository.findOneBy({
      name: data.name,
    });

    if (existingPermission) {
      throw new ConflictException(
        validationMessagePermissions.CREATE_CONFLICT.NAME,
      );
    }

    const savedPermission = await this.permissionRepository.save(data);

    return {
      statusCode: HttpStatus.CREATED,
      message: validationMessagePermissions.CREATED,
      timestamp: new Date().toISOString(),
      path: `/api/v1/permissions`,
      data: savedPermission,
    };
  }

  @UseFilters(AllExceptionsFilter)
  async findTable(
    query: FilterPermissionDto,
  ): Promise<ResponsePermissionTableDto> {
    let take = Number(query.take);
    const page = Number(query.page) || 1;

    take = Math.max(0, take || 5); // Asegurar que take sea al menos 0
    const skip = (Math.max(1, page || 1) - 1) * take;

    let where: FindOptionsWhere<Permissions> = {
      isDelete: false,
    };

    if (query.name) {
      where = {
        name: ILike(`%${query.name}%`),
      };
    }

    if (query.description) {
      where = {
        description: ILike(`%${query.description}%`),
      };
    }

    const [data, totalData] = await this.permissionRepository.findAndCount({
      where,
      take,
      skip,
      order: { id: 'ASC' },
    });

    const totalPages = Math.ceil(totalData / take);

    if (data.length === 0) {
      throw new NotFoundException(
        validationMessagePermissions.NOT_CONTENT.PERMISSIONS,
      );
    }

    return { data, totalData, totalPages, currentPage: page };
  }

  @UseFilters(AllExceptionsFilter)
  async findOne(id: number): Promise<Permissions | AllResponseFilter> {
    const permission = await this.permissionRepository.findOneBy({ id });

    if (!permission) {
      throw new NotFoundException(
        validationMessagePermissions.NOT_CONTENT.PERMISSION,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: validationMessagePermissions.OK.CONTENT,
      timestamp: new Date().toISOString(),
      path: `/api/v1/profiles/${id}`,
      data: permission,
    };
  }

  @UseFilters(AllExceptionsFilter)
  async update(
    id: number,
    data: UpdatePermissionDto,
  ): Promise<Permissions | AllResponseFilter> {
    const permission = await this.permissionRepository.findOneBy({
      id,
    });

    if (!permission) {
      throw new NotFoundException(
        validationMessagePermissions.NOT_CONTENT.PERMISSION,
      );
    }

    Object.assign(permission, data);

    try {
      await this.permissionRepository.save(permission);

      return {
        statusCode: HttpStatus.OK,
        message: validationMessagePermissions.OK.UPDATE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/profiles/${id}`,
        data: await this.permissionRepository.findOneBy({ id }),
      };
    } catch (error) {
      switch (error.length) {
        case 237:
          throw new ConflictException(
            'El nombre del permiso ya se encuentra en uso con otro permiso, por favor intenta otro nombre',
          );
      }
    }
  }

  // Eliminar nuevo
  @UseFilters(AllExceptionsFilter)
  async delete(id: number): Promise<Permissions | AllResponseFilter> {
    const existingPermission = await this.permissionRepository.findOneBy({
      id,
    });

    if (!existingPermission) {
      throw new NotFoundException(
        validationMessagePermissions.NOT_CONTENT.PERMISSION,
      );
    }

    const isDelete = !existingPermission.isDelete;
    await this.permissionRepository.update(id, {
      isDelete: isDelete,
    });

    if (isDelete) {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessagePermissions.OK.DELETE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${id}`,
        data: { isDelete }, // Retornar el nuevo valor de isDelete
      };
    } else {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessagePermissions.OK.RESTORE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${id}`,
        data: { isDelete }, // Retornar el nuevo valor de isDelete
      };
    }
  }
}
