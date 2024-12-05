import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Importante esto es el profiles_key implementado en el decorador de profiles.decorator.ts GROUP_KEY
import {
  GROUP_KEY,
  PERMISSIONS_KEY,
} from '../decorators/profiles.decorator';

@Injectable()
export class ProfilesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredGroupDescription = this.reflector.get<string[]>(
      GROUP_KEY,
      context.getHandler(),
    );
    const requiredPermissions = this.reflector.get<{
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
    }>(PERMISSIONS_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.groupId || !user) {
      throw new ForbiddenException(
        'Acceso denegado: Usuario no válido o sin perfil.',
      );
    }

    // Comprobar si el usuario es root
    if (user.is_root) {
      return true; // Permitir acceso a todos los usuarios con is_root: true
    }

    if (!user || !user.is_staff) {
      throw new ForbiddenException(
        'Acceso denegado: Solo personal autorizado.',
      );
    }

    const hasRequiredGroup = requiredGroupDescription.some((groupId) =>
      user.groupId.includes(groupId),
    );

    const userPermissions = user.permissions;
    const hasRequiredPermissions =
      (!requiredPermissions.create || userPermissions.create) &&
      (!requiredPermissions.read || userPermissions.read) &&
      (!requiredPermissions.update || userPermissions.update) &&
      (!requiredPermissions.delete || userPermissions.delete);

    if (!hasRequiredPermissions) {
      throw new ForbiddenException('Acceso denegado: no tiene permiso.');
    }

    return true;
  }
}
