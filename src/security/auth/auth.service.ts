import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Inject,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  UseFilters,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import Users from '../users/entities/users.entity';
import { UsersServices } from '../users/users.service';
import { LoginDto } from './dto/login-auth.dto';
import {
  validationMessageServer,
  validationMessageUser,
} from 'src/common/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from 'src/core/errors/all-exceptions.filter';
import { Request } from 'express'; // Importar Request
import { UnlockAccountDto } from './dto/unlock-account.dto';
import { SendEmailDto } from '../email/dtos/send-email.dto';
import { EmailService } from '../email/services/email/email.service';
import { RecoveryCodeDto } from './dto/reset-code.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { FilterUserDto, FilterUserVerifyDto } from './dto/filter-user.dto';
import { REQUEST } from '@nestjs/core';
import { RestoreGmailDto } from './dto/restore-gmail.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,

    private readonly usersService: UsersServices,
    private readonly jwtService: JwtService,
    private emailService: EmailService,

    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async login({ email, password }: LoginDto): Promise<{
    token: string;
  }> {
    try {
      // Busca al usuario incluyendo el campo de contraseña
      const user = await this.usersService.findOneByEmailWithPassword(email);

      const userPasswords = await this.usersService.findAllPassword(user.id);

      if (!userPasswords) {
        throw new UnauthorizedException(
          validationMessageUser.NOT_CONTENT.USER_PASSWORD,
        );
      }

      if (!user) {
        throw new UnauthorizedException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Validar si el usuario existe pero esta eliminado
      if (user && !user.is_active) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Validar si el usuario existe pero no está activo
      if (user && !user.is_staff) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.ACTIVE);
      }

      // Si el usuario está bloqueado
      if (user.is_locked) {
        throw new UnauthorizedException(validationMessageUser.OK.BLOCKED_USER);
      }

      // Verificar la contraseña
      const passwordMatches = await bcryptjs.compare(password, user.password_id.password);

      if (!passwordMatches) {
        // Incrementar el contador de intentos fallidos
        user.failed_attempts += 1;

        // Si los intentos fallidos llegan a 3, bloquear el usuario
        if (user.failed_attempts >= 3) {
          user.is_locked = true;

          await this.usersRepository.save(user); // Guarda el usuario actualizado
          throw new UnauthorizedException(
            validationMessageUser.OK.BLOCKED_USER,
          );
        }

        // Guardar el usuario con el contador de intentos fallidos actualizado
        await this.usersRepository.save(user);
        throw new UnauthorizedException(
          `Contraseña incorrecta. Intento ${user.failed_attempts} de 3`,
        );
      }

      // Si la contraseña es correcta, reiniciar el contador de intentos fallidos
      user.failed_attempts = 0;
      await this.usersRepository.save(user);

      // Verifica si el grupo y los permisos están disponibles
      if (!user.group_description || !user.group_description.groupPermission) {
        throw new UnauthorizedException(
          'No hay permisos asociados al grupo de usuarios',
        );
      }

      const groupPermission = user.group_description.groupPermission.find(
        (perm) => perm.group_id === perm.group_id,
      );

      if (!groupPermission) {
        throw new UnauthorizedException(
          'No se encontraron permisos para la clase de usuario',
        );
      }

      // Configura los permisos
      const permissions = {
        create: groupPermission.create || false,
        read: groupPermission.read || false,
        update: groupPermission.update || false,
        delete: groupPermission.delete || false,
      };

      // Configura los detalles del grupo
      const groupId = [
        {
          id: user.group_description.id,
          description: user.group_description.description,
        },
      ];

      // Construye el payload para el token
      const payload = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        groupId: groupId.map((group) => group.description),
        permissions,
        is_root: user.is_root,
        is_staff: user.is_staff,
      };

      // Firma el token
      const token = await this.jwtService.signAsync(payload);

      // Retorna la respuesta
      return {
        token,
      };
    } catch (error) {
      console.log(error);

      // Maneja los errores y los lanza con un formato adecuado
      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Si es otro error, lanza un InternalServerErrorException o similar
      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // private async findUserByCredentials(data: LoginDto): Promise<Users | null> {
  //   // Busca el usuario en la base de datos por correo electrónico
  //   const user = await this.usersService.findOneByEmail(data.email);
  //   return user;
  // }

  // Método para decodificar el token
  decodeToken(token: string): Promise<{
    token: string;
    email: string;
    groupId: { id: number; description: string }[]; // Ajustar aquí también
    permissions: number; // Retornar permisos junto con la respuesta
  }> {
    try {
      return this.jwtService.verify(token); // Esto retornará los datos decodificados
    } catch {
      throw new UnauthorizedException('Token no válido');
    }
  }

  @UseFilters(AllExceptionsFilter)
  async findOne(
    data: FilterUserDto,
  ): Promise<Users | AllResponseFilter> {
    try {
      // Buscar el usuario por ID e incluir relaciones de perfiles (roles)
      const user = await this.usersRepository.findOne({
        where: { ci: data.ci, email: data.email, birthdate: data.birthdate },
      });

      // En caso de no existir el usuario
      if (!user) {
        throw new NotFoundException(validationMessageUser.NOT_CONTENT.USER);
      }

      const userIsLocked = await this.usersRepository.findOne({
        where: {
          ci: data.ci,
          email: data.email,
          birthdate: data.birthdate,
          is_locked: true,
        },
      });

      if (userIsLocked) {
        throw new ForbiddenException(validationMessageUser.OK.BLOCKED);
      }

      // Devolver la respuesta en formato estandarizado
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.CONTENT,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        path: this.request.url,
        data: true,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseFilters(AllExceptionsFilter)
  async unlockAccount(
    data: UnlockAccountDto,
  ): Promise<Users | AllResponseFilter> {
    try {
      const userExist = await this.usersRepository.findOne({
        where: {
          email: data.email,
          ci: data.ci,
          birthdate: data.birthdate,
          is_active: true,
          is_staff: true,
        },
      });

      if (!userExist) {
        throw new NotFoundException(validationMessageUser.NOT_CONTENT.USER);
      }

      const user = await this.usersRepository.findOne({
        where: {
          email: data.email,
          ci: data.ci,
          birthdate: data.birthdate,
          is_active: true,
          is_staff: true,
          is_locked: true,
        },
      });

      if (!user) {
        throw new ConflictException(
          'Este usuario no se encuentra bloqueado, puede iniciar sesión.',
        );
      }

      // Resetear el estado de bloqueo
      user.is_locked = false;
      user.failed_attempts = 0;

      await this.usersRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.UNLOCK,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        path: this.request.url,
        data: {
          username: user.username,
          email: user.email,
        }, // Retornar el usuario actualizado
      };
    } catch (error) {
      console.log(error);

      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  @UseFilters(AllExceptionsFilter)
  async resetCode(
    data: RecoveryCodeDto,
  ): Promise<Users | AllResponseFilter> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email: data.email,
          ci: data.ci,
          birthdate: data.birthdate,
          is_active: true,
          is_staff: true,
        },
      });

      if (!user) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      if (user.is_locked) {
        throw new UnauthorizedException('false');
      }

      const code = Math.random().toString(36).slice(-5);
      const hashedCode = await bcryptjs.hash(code, 10);

      // Preparar los datos del correo
      const sendEmailDto: SendEmailDto = {
        from: 'serviciosesteban953@gmail.com',
        subjectEmail: 'Bienvenido',
        sendTo: user.email,
        template: 'welcome',
        params: { password: code, username: user.username },
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

      user.recovery_code = hashedCode;

      await this.usersRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.CODE,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        path: this.request.url,
        data: {
          username: user.username,
          email: user.email,
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
  async restorePassword(
    data: RestorePasswordDto,
  ): Promise<Users | AllResponseFilter> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersRepository.findOne({
        where: {
          email: data.email,
          ci: data.ci,
          birthdate: data.birthdate,
          is_active: true,
          is_staff: true,
        },
      });

      if (!user) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      if (user.is_locked) {
        throw new ConflictException(validationMessageUser.OK.BLOCKED);
      }

      if (!user.recovery_code) {
        throw new UnprocessableEntityException(
          validationMessageUser.NOT_OK.CODE,
        );
      }

      const codeMatches = await bcryptjs.compare(
        data.recovery_code,
        user.recovery_code,
      );

      if (!codeMatches) {
        throw new UnprocessableEntityException(
          validationMessageUser.NOT_OK.CODE,
        );
      }

      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatePassword, 10);

      // Preparar los datos del correo
      const sendEmailDto: SendEmailDto = {
        from: 'serviciosesteban953@gmail.com',
        subjectEmail: 'Bienvenido',
        sendTo: user.email,
        template: 'welcome',
        params: { password: generatePassword, username: user.username },
      };

      // Intentar enviar el correo
      try {
        await this.emailService.sendEmail(sendEmailDto);
      } catch (emailError) {
        // Lanzar excepción si falla el envío del correo
        throw new InternalServerErrorException(
          `Error al enviar el correo por favor verifique la conexión`,
          emailError.stack,
        );
      }

      user.recovery_code = null;
      user.password_id.password = hashedPassword;
      user.lastPasswordChange = new Date();
      user.recovery_code = null;
      await queryRunner.manager.save(user);

      // Crear la nueva contraseña
      const newPassword = new Password();
      newPassword.password = hashedPassword;
      newPassword.users = user;
      newPassword.status = true;
      const updatedUser = await queryRunner.manager.save(newPassword);

      await queryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.RESTORE_PASSWORD,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        path: this.request.url,
        data: {
          username: updatedUser.users.username,
          email: updatedUser.users.email,
        }, // Retornar el usuario actualizado
      };
    } catch (error) {
      console.log(error);

      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException ||
        error instanceof UnprocessableEntityException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  @UseFilters(AllExceptionsFilter)
  async findOneUser(
    data: FilterUserVerifyDto,
  ): Promise<Users | AllResponseFilter> {
    try {
      // Buscar el usuario por ID e incluir relaciones de perfiles (roles)
      const user = await this.usersRepository.findOne({
        where: { ci: data.ci, birthdate: data.birthdate },
      });

      // En caso de no existir el usuario
      if (!user) {
        throw new NotFoundException(validationMessageUser.NOT_CONTENT.USER);
      }

      const userIsLocked = await this.usersRepository.findOne({
        where: {
          ci: data.ci,
          birthdate: data.birthdate,
          is_locked: true,
        },
      });

      if (userIsLocked) {
        throw new ForbiddenException(validationMessageUser.OK.BLOCKED);
      }

      // Devolver la respuesta en formato estandarizado
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.CONTENT,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: true,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        validationMessageServer.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseFilters(AllExceptionsFilter)
  async restoreGmail(
    data: RestoreGmailDto,
  ): Promise<Users | AllResponseFilter> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          ci: data.ci,
        },
      });

      if (!user) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      if (user.is_locked) {
        throw new ConflictException(validationMessageUser.OK.BLOCKED);
      }

      user.email = data.email;

      await this.usersRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageUser.OK.RESTORE_GMAIL,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: {
          username: user.username,
        }, // Retornar el usuario actualizado
      };
    } catch (error) {
      console.log(error);

      if (
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }
}
