import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Request } from 'express'; // Importar Request

// ENTITIES
import Users from './entities/users.entity';
import Group from '../group/entities/group.entity';

// DTO
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FilterUserDto, ResponseUsersDto } from './dto/filter-user.dto';

// MANEJO DE ERRORES GLOBALES
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from '../../core/errors/all-exceptions.filter';

// ENVIAR CONTRASEÑA POR EMAIL
import { SendEmailDto } from '../email/dtos/send-email.dto';
import { EmailService } from '../email/services/email/email.service';

// MENSAJE VALIDACIONES
import {
  validationMessageGroup,
  validationMessageServer,
  validationMessageUser,
} from '../../common/constants/index';
import { UpdatePasswordUserDto } from './dto/update-password-users.dto';

import { omit } from 'lodash';
import { REQUEST } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,

    private readonly dataSource: DataSource,

    private emailService: EmailService,

    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @UseFilters(AllExceptionsFilter)
  async create(data: CreateUserDto): Promise<AllResponseFilter> {
    try {
      // Verificar si ya existe un usuario activo con el mismo email
      const existingUserByEmail = await this.usersRepository.findOne({
        where: { email: data.email, is_active: true },
      });
      if (existingUserByEmail) {
        throw new ConflictException(validationMessageUser.CONFLICT.EMAIL);
      }

      // Verificar si ya existe un usuario activo con el mismo usuario
      const existingUserByUsername = await this.usersRepository.findOne({
        where: { username: data.username, is_active: true },
      });
      if (existingUserByUsername) {
        throw new ConflictException(validationMessageUser.CONFLICT.USER);
      }

      // Verificar si ya existe un usuario activo con la misma cédula
      const existingUserByCi = await this.usersRepository.findOne({
        where: { ci: data.ci, is_active: true },
      });
      if (existingUserByCi) {
        throw new ConflictException(validationMessageUser.CONFLICT.CI);
      }

      // Verificar si el group existe
      const group = await this.groupRepository.findOne({
        where: { id: data.group_description_id, is_deleted: false },
      });
      if (!group) {
        throw new ConflictException(validationMessageGroup.NOT_CONTENT.GROUP);
      }

      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      // Preparar los datos del correo
      const sendEmailDto: SendEmailDto = {
        from: 'serviciosesteban953@gmail.com',
        subjectEmail: 'Bienvenido',
        sendTo: data.email,
        template: 'welcome',
        params: { password: generatedPassword, username: data.username },
      };

      // Intentar enviar el correo
      try {
        await this.emailService.sendEmail(sendEmailDto);
      } catch (emailError) {
        // Lanzar excepción si falla el envío del correo
        throw new InternalServerErrorException(
          `Error al enviar el correo a ${data.email}: ${emailError.message}`,
          emailError.stack,
        );
      }

      // Crear y guardar el usuario solo si el correo se envió con éxito
      const user = new Users();
      user.code = data.origen + data.ci;
      user.username = data.username;
      user.email = data.email;
      user.origen = data.origen;
      user.ci = data.ci;
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.password = hashedPassword;
      user.phone = data.phone;
      user.failed_attempts = data.failed_attempts;
      user.birthdate = data.birthdate;
      user.group_description = group;

      const savedUser = await this.usersRepository.save(user);

      return {
        statusCode: HttpStatus.CREATED,
        message: validationMessageUser.OK.CREATED,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: savedUser,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseFilters(AllExceptionsFilter)
  async findTable(query: FilterUserDto): Promise<ResponseUsersDto> {
    let take = Number(query.take);
    const page = Number(query.page) || 0; // Establecer el valor por defecto de page en 1

    take = Math.max(0, take || 5); // Asegurar que take sea al menos 1

    const skip = page * take; // Calcular el valor de skip

    const where: FindOptionsWhere<Users> = {
      is_active: true,
    };

    if (query.username) {
      where.username = ILike(`%${query.username}%`); // Filtrar por email
    }

    if (query.email) {
      where.email = ILike(`%${query.email}%`); // Filtrar por email
    }

    const [data, totalData] = await this.usersRepository.findAndCount({
      where,
      take,
      skip,
      relations: {
        group_description: true,
      },
      order: { id: 'ASC' }, // Orden de id
    });

    console.log(data);

    // Mapeo para incluir el nombre y el ID de group_description y state, omitiendo la contraseña
    const mappedData = data.map((user) => ({
      ...user,
      password: undefined,
      group_description: user.group_description
        ? {
            id: user.group_description.id,
            name: user.group_description.description, // "description"
          }
        : undefined, // Solo incluir el nombre y el ID de group_description si existe
    })) as (Users & {
      group_description: { id: number; name: string } | undefined;
    })[];

    const totalPages = Math.ceil(totalData / take);

    return { data: mappedData, totalData, totalPages, currentPage: page };
  }

  @UseFilters(AllExceptionsFilter)
  async findOne(id: number): Promise<Users | AllResponseFilter> {
    try {
      // Buscar el usuario por ID e incluir relaciones de perfiles (roles)
      const user = await this.usersRepository.findOne({
        where: { id },
      });

      // En caso de no existir el usuario
      if (!user) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Devolver la respuesta en formato estandarizado
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.CONTENT,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseFilters(AllExceptionsFilter)
  async updateUser(
    id: number,
    data: UpdateUserDto,
  ): Promise<Users | AllResponseFilter> {
    // Iniciar una transacción con QueryRunner
    const queryRunner = this.dataSource.createQueryRunner();

    // Conectar y comenzar la transacción
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: {
          group_description: true,
        },
      });

      // Validar si el usuario existe
      if (!user) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Validar email, cédula y username solo si se proporcionan
      if (data.email || data.ci || data.username) {
        // Crear condiciones para la búsqueda
        const whereConditions = [];
        if (data.email) {
          whereConditions.push({ email: data.email, is_active: false });
        }
        if (data.ci) {
          whereConditions.push({ ci: data.ci, is_active: false });
        }
        if (data.username) {
          whereConditions.push({ username: data.username, is_active: false });
        }

        // Buscar usuarios que coincidan con las condiciones
        const existingUser = await this.usersRepository.findOne({
          where: whereConditions,
        });

        if (existingUser && existingUser.id !== id) {
          // Determinar cuál de los campos tiene conflicto
          let message = '';
          if (existingUser.email === data.email) {
            message = validationMessageUser.CONFLICT.EMAIL;
          } else if (Number(existingUser.ci) === Number(data.ci)) {
            message = validationMessageUser.CONFLICT.CI;
          } else if (existingUser.username === data.username) {
            message = validationMessageUser.CONFLICT.USER;
          }
          throw new ConflictException(message);
        }
      }

      // Actualizar group_description si se proporciona un ID de group
      if (data.group_description_id) {
        const group_description = await this.groupRepository.findOne({
          where: { id: data.group_description_id, is_deleted: false },
        });
        // En caso de no existir el group_description
        if (group_description) {
          user.group_description = group_description; // Asignar el group al usuario
        } else {
          throw new ConflictException(validationMessageGroup.NOT_CONTENT.GROUP);
        }
      }

      // // Actualizar contraseña si se proporciona una nueva contraseña
      // if (data.password) {
      //   try {
      //     const salt = await bcryptjs.genSalt();
      //     const hashedPassword = await bcryptjs.hash(data.password, salt);
      //     user.password = hashedPassword; // Asignar la nueva contraseña hasheada al usuario
      //   } catch {
      //     throw new InternalServerErrorException('Error hashing password');
      //   }
      // }

      // Combinar los datos del objeto data con el objeto user
      Object.assign(user, data);

      // Guardar actualización con queryRunner
      await queryRunner.manager.save(user);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      // if (data.password) {
      //   user.password = await bcryptjs.hash(
      //     data.password,
      //     await bcryptjs.genSalt(),
      //   );
      // }

      // Obtener el usuario actualizado
      const updatedUser = await this.usersRepository.findOne({
        where: { id },
        relations: {
          group_description: true,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.UPDATE,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: updatedUser, // Retornar el usuario actualizado
      };
    } catch (error) {
      // Revertir la transacción en caso de un error
      await queryRunner.rollbackTransaction();
      throw error; // Propagar el error
    } finally {
      // Liberar el queryRunner después de la transacción
      await queryRunner.release();
    }
  }

  @UseFilters(AllExceptionsFilter)
  async findOneByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: { email },
      relations: {
        group_description: true, // Incluir los perfiles relacionados
      },
    });
  }

  @UseFilters(AllExceptionsFilter)
  async findOneByEmailWithPassword(email: string): Promise<Users | null> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['group_description', 'group_description.groupPermission'],
    });
  }

  @UseFilters(AllExceptionsFilter)
  async isActive(id: number): Promise<Users | AllResponseFilter> {
    try {
      // Buscar el usuario por ID
      const existingUser = await this.usersRepository.findOneBy({ id });

      // Si no existe el usuario, lanzar excepción
      if (!existingUser) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Cambiar el estado de isActive
      const is_active = !existingUser.is_active;
      await this.usersRepository.update(id, { is_active });

      if (is_active) {
        return {
          statusCode: HttpStatus.OK,
          message: validationMessageUser.OK.ACTIVATED,
          timestamp: new Date().toISOString(),
          path: this.request.url,
          data: { is_active },
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: validationMessageUser.OK.DEACTIVATE,
          timestamp: new Date().toISOString(),
          path: this.request.url,
          data: { is_active },
        };
      }
    } catch (error) {
      console.log(error); // Puedes usar un logger para mejor trazabilidad de errores

      // Si el error es una excepción conocida, lo lanzamos
      if (error instanceof ConflictException) {
        throw error;
      }

      // Si el error no es esperado, lanzamos un InternalServerErrorException
      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseFilters(AllExceptionsFilter)
  async isStaff(id: number): Promise<Users | AllResponseFilter> {
    try {
      // Buscar el usuario por ID
      const existingUser = await this.usersRepository.findOneBy({ id });

      // Si no existe el usuario, lanzar excepción
      if (!existingUser) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Cambiar el estado de isStaff
      const is_staff = !existingUser.is_staff;
      await this.usersRepository.update(id, { is_staff });

      // Devolver la respuesta en formato estandarizado
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.CONTENT,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: { is_staff },
      };
    } catch (error) {
      console.log(error); // Puedes usar un logger para mejor trazabilidad de errores

      // Si el error es una excepción conocida, lo lanzamos
      if (error instanceof ConflictException) {
        throw error;
      }

      // Si el error no es esperado, lanzamos un InternalServerErrorException
      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseFilters(AllExceptionsFilter)
  async isRoot(id: number): Promise<Users | AllResponseFilter> {
    try {
      // Buscar el usuario por ID
      const existingUser = await this.usersRepository.findOneBy({ id });

      // Si no existe el usuario, lanzar una excepción
      if (!existingUser) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Cambiar el estado de isRoot
      const is_root = !existingUser.is_root;
      await this.usersRepository.update(id, { is_root });

      // Devolver la respuesta en formato estandarizado
      if (is_root) {
        return {
          statusCode: HttpStatus.OK,
          message: validationMessageUser.OK.ROOT_ACTIVATED,
          timestamp: new Date().toISOString(),
          path: this.request.url,
          data: { is_root }, // Retornar el nuevo valor de is_root
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: validationMessageUser.OK.ROOT_DEACTIVATE,
          timestamp: new Date().toISOString(),
          path: this.request.url,
          data: { is_root }, // Retornar el nuevo valor de is_root
        };
      }
    } catch (error) {
      console.log(error); // Puedes usar un logger para mejor trazabilidad de errores

      // Si el error es una excepción conocida, la lanzamos
      if (error instanceof ConflictException) {
        throw error;
      }

      // Si el error es inesperado, lanzamos un InternalServerErrorException
      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseFilters(AllExceptionsFilter)
  async changePassword(
    data: UpdatePasswordUserDto,
  ): Promise<Users | AllResponseFilter> {
    try {
      // Obtener el encabezado Authorization
      const authHeader = this.request.headers['authorization'];
      let decoded: JwtPayload;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7, authHeader.length); // Extraemos el token

        decoded = jwt.decode(token) as JwtPayload;
      } else {
        throw new ConflictException(
          'No se ha proporcionado un token de autorización',
        );
      }

      const user = await this.usersRepository.findOne({
        where: { id: decoded.id, is_active: true },
      });

      if (!user) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Validar la contraseña actual proporcionada
      const isPasswordValid = await bcryptjs.compare(
        data.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException(
          validationMessageUser.CONFLICT.PASSWORD,
        );
      }

      // Verificar que la nueva contraseña no sea igual a la anterior
      const isNewPasswordSameAsOld = await bcryptjs.compare(
        data.password,
        user.password,
      );

      if (isNewPasswordSameAsOld) {
        throw new ConflictException(
          validationMessageUser.CONFLICT.SAME_PASSWORD,
        );
      }

      const hashedPassword = await bcryptjs.hash(data.password, 10);
      // Actualizar la contraseña en el usuario
      user.password = hashedPassword;
      user.lastPasswordChange = new Date();
      const updatedUser = await this.usersRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.PASSWORD,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
        }, // Retornar el usuario actualizado
      };
    } catch (error) {
      console.log(error);

      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  @UseFilters(AllExceptionsFilter)
  async filterAccountData(): Promise<Users | AllResponseFilter> {
    try {
      // Obtener el encabezado Authorization
      const authHeader = this.request.headers['authorization'];
      let decoded: JwtPayload;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7, authHeader.length); // Extraemos el token

        decoded = jwt.decode(token) as JwtPayload;
      } else {
        throw new ConflictException(
          'No se ha proporcionado un token de autorización',
        );
      }

      // Buscar el usuario por ID e incluir relaciones de perfiles (roles)
      const user = await this.usersRepository.findOne({
        where: { id: decoded.id },
      });

      // En caso de no existir el usuario
      if (!user) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Excluir campos no deseados
      const filteredUser = omit(user, [
        'code',
        'lastPasswordChange',
        'password',
        'is_locked',
        'failed_attempts',
        'is_active',
        'is_staff',
        'is_root',
        'recovery_code',
      ]);

      // Devolver la respuesta en formato estandarizado
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.CONTENT,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: filteredUser,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(
    data: UpdateProfileDto,
  ): Promise<Users | AllResponseFilter> {
    try {
      // Obtener el encabezado Authorization
      const authHeader = this.request.headers['authorization'];
      let decoded: JwtPayload;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7, authHeader.length); // Extraemos el token

        decoded = jwt.decode(token) as JwtPayload;
      } else {
        throw new ConflictException(
          'No se ha proporcionado un token de autorización',
        );
      }

      const user = await this.usersRepository.findOne({
        where: { id: decoded.id, is_active: true },
      });

      if (!user) {
        throw new NotFoundException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Actualizar el usuario con los datos proporcionados
      const response = await this.usersRepository.update(user.id, data);

      console.log(response);

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.UPDATE,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: user.username,
      };
    } catch (error) {
      console.log(error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }
}
