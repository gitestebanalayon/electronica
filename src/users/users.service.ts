import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import Profiles from '../profiles/entities/profiles.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import Users from './entities/users.entity';

import { FilterUserDto, ResponseUsersTableDto } from './dto/filter-user.dto';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from 'src/core/errors/all-exceptions.filter';
import { validationMessageUsers } from 'src/common/constants';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Profiles)
    private readonly profilesRepository: Repository<Profiles>,
  ) {}

  @UseFilters(AllExceptionsFilter)
  async create(data: CreateUserDto): Promise<Users | AllResponseFilter> {
    let messageErrorUser: string;

    const existingUsers = await this.usersRepository.findOne({
      where: [{ email: data.email }, { ci: data.ci }],
    });

    if (data.nationality != 'V' && data.nationality != 'E') {
      throw new ConflictException(
        validationMessageUsers.CREATE_CONFLICT.NATIONALITY,
      );
    }

    if (existingUsers) {
      if (existingUsers.email === data.email) {
        messageErrorUser = validationMessageUsers.CREATE_CONFLICT.EMAIL;
      } else if (Number(existingUsers.ci) === data.ci) {
        messageErrorUser = validationMessageUsers.CREATE_CONFLICT.CI;
      }
      throw new ConflictException(messageErrorUser);
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const profile = await this.profilesRepository.findOne({
      where: { id: data.profile },
    });

    if (!profile) {
      throw new ConflictException(validationMessageUsers.NOT_CONTENT.PROFILE);
    }

    const user = new Users();
    user.email = data.email;
    user.password = hashedPassword;
    user.nationality = data.nationality;
    user.ci = data.ci;
    user.phone = data.phone;
    user.failedAttempts = data.failedAttempts;
    user.isActive = data.isActive;
    user.birthdate = data.birthdate;
    user.profile = profile;

    const savedUser = await this.usersRepository.save(user);

    return {
      statusCode: HttpStatus.CREATED,
      message: validationMessageUsers.CREATED,
      timestamp: new Date().toISOString(),
      path: `/api/v1/users`,
      data: savedUser,
    };
  }

  @UseFilters(AllExceptionsFilter)
  async findTable(query: FilterUserDto): Promise<ResponseUsersTableDto> {
    let take = Number(query.take);
    const page = Number(query.page) || 1; // Establecer el valor por defecto de page en 1

    take = Math.max(1, take || 5); // Asegurar que take sea al menos 1

    const skip = (Math.max(1, page || 1) - 1) * take;

    const where: FindOptionsWhere<Users> = {
      isDelete: false,
    };

    if (query.email) {
      where.email = ILike(`%${query.email}%`); // Filtrar por email
    }

    if (query.profile) {
      where.profile = { id: query.profile }; // Filtrar por el id del perfil
    }

    const [data, totalData] = await this.usersRepository.findAndCount({
      where,
      take,
      skip,
      relations: ['profile'], // Incluyendo profile
      order: { id: 'ASC' }, // Ordenar por Id
    });

    const mappedData = data.map((user) => ({
      ...user,
      password: undefined,
      profile: {
        id: user.profile?.id, // Solo incluir el id del perfil
        name: user.profile?.name, // Solo incluir el nombre del perfil
      },
    })) as (Users & { profile: { id: number; name: string } })[];

    const totalPages = Math.ceil(totalData / take);

    return { data: mappedData, totalData, totalPages, currentPage: page };
  }

  @UseFilters(AllExceptionsFilter)
  async findOne(id: number): Promise<Users | AllResponseFilter> {
    // Buscar el usuario por ID e incluir relaciones de perfiles (roles)
    const getUser = await this.usersRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });

    // En caso de no existir el usuario
    if (!getUser) {
      throw new NotFoundException(validationMessageUsers.NOT_CONTENT.USER);
    }

    const user = { ...getUser, password: undefined };

    return {
      statusCode: HttpStatus.OK,
      message: validationMessageUsers.OK.CONTENT,
      timestamp: new Date().toISOString(),
      path: `/api/v1/users/${id}`,
      data: user, // Retornar el usuario actualizado
    };
  }

  @UseFilters(AllExceptionsFilter)
  async updateUser(
    id: number,
    data: UpdateUserDto,
  ): Promise<Users | AllResponseFilter> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });

    // Verificar si existe el usuario
    if (!user) {
      throw new NotFoundException(validationMessageUsers.NOT_CONTENT.USER);
    }

    // Actualizar profile si se proporciona un ID de perfil
    if (data.profile) {
      const profile = await this.profilesRepository.findOne({
        where: { id: data.profile },
      });
      // En caso de no existir el profile
      if (profile) {
        data.profile = profile.id; // Asignar el perfil al usuario
      } else {
        throw new NotFoundException(validationMessageUsers.NOT_CONTENT.PROFILE);
      }
    }
    Object.assign(user, data);

    try {
      await this.usersRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUsers.OK.UPDATE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${id}`,
        data: await this.usersRepository.findOne({
          where: { id },
          relations: { profile: true },
        }),
      };
    } catch (error) {
      switch (error.length) {
        case 241:
          throw new ConflictException(
            'El email ya se encuentra existente y esta siendo usado por otro usuario',
          );
        case 114:
          throw new ConflictException('La nacionalidad solo admite 1 dígito');
        case 359:
          throw new ConflictException(
            'Solo se permite V o E en la nacionalidad del usuario y en mayúscula',
          );
        case 360:
          throw new ConflictException(
            'Solo se permite V o E en la nacionalidad del usuario y en mayúscula',
          );
        case 231:
          throw new ConflictException(
            'La cédula ya se encuentra existente y esta siendo usada por otro usuario',
          );
      }
    }
  }

  // Encuentra un usuario por email sin la contraseña
  async findOneByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: { email },
      relations: {
        profile: true, // Incluir los perfiles relacionados
      },
    });
  }

  // Nuevo para cuando pones select: false en la contraseña entity de usuario
  async findOneByEmailWithPassword(email: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password' /* 'profiles' */], // Incluir password explícitamente
      relations: {
        profile: true, // Incluir los perfiles relacionados
      },
    });
  }

  // Usuario activo o no activo
  @UseFilters(AllExceptionsFilter)
  async isActive(id: number): Promise<Users | AllResponseFilter> {
    const existingUser = await this.usersRepository.findOneBy({ id });

    if (!existingUser) {
      throw new NotFoundException(validationMessageUsers.NOT_CONTENT.USER);
    }

    // Cambiar el estado de isActive
    const isActive = !existingUser.isActive;
    await this.usersRepository.update(id, { isActive });

    if (isActive) {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUsers.OK.ACTIVATE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${id}`,
        data: { isActive }, // Retornar el nuevo valor de isActive
      };
    } else {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUsers.OK.DEACTIVATE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${id}`,
        data: { isActive }, // Retornar el nuevo valor de isActive
      };
    }
  }

  // Usuario eliminado o no eliminado
  @UseFilters(AllExceptionsFilter)
  async isDelete(id: number): Promise<Users | AllResponseFilter> {
    const existingUser = await this.usersRepository.findOneBy({ id });

    if (!existingUser) {
      throw new NotFoundException(validationMessageUsers.NOT_CONTENT.USER);
    }

    const isDelete = !existingUser.isDelete;
    await this.usersRepository.update(id, { isDelete });

    if (isDelete) {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUsers.OK.DELETE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${id}`,
        data: { isDelete }, // Retornar el nuevo valor de isDelete
      };
    } else {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUsers.OK.RESTORE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${id}`,
        data: { isDelete }, // Retornar el nuevo valor de isDelete
      };
    }
  }
}
