import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Users from 'src/security/users/entities/users.entity';
import { validationMessageUser } from 'src/common/constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no valido');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      // Obtener el usuario desde la base de datos
      const user = await this.usersRepository.findOne({
        where: { id: payload.id, is_active: true },
      });

      if (!user) {
        throw new UnauthorizedException(validationMessageUser.NOT_CONTENT.USER);
      }

      // Validar si el token es anterior al último cambio de contraseña
      if (
        user.lastPasswordChange &&
        payload.iat * 1000 < user.lastPasswordChange.getTime()
      ) {
        throw new UnauthorizedException(
          'Tu sesión ha expirado debido al cambio de contraseña. Por favor, inicia sesión nuevamente.',
        );
      }

      // Agregar los datos del usuario al request
      request.user = payload;
    } catch (error) {
      console.log(error);

      // Manejar el error de token expirado
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        );
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }

    return true;
  }

  // Desestructurar token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
