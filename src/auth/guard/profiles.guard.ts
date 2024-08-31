import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Importante esto es el profiles_key implementado en el decorador de profiles.decorator.ts PROFILES_KEY
import { PROFILES_KEY } from '../decorators/profiles.decorator';

@Injectable()
export class ProfilesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} // Esto permitirá leer el rol

  canActivate(context: ExecutionContext): boolean {
    const requiredProfiles = this.reflector.get<string[]>(
      PROFILES_KEY,
      context.getHandler(),
    );

    // En caso de no existir los roles
    if (!requiredProfiles) {
      return true; // Si no se especifican perfiles, permitir el acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Validar que el profile o rol ADMIN tenga poder encima de otros roles
    // Debes verificar si el perfil ADMIN está en el array de perfiles del usuario, no una comparación de cadenas
    const isAdmin = user.profiles.some((profile) => profile.name === 'Admin');

    if (isAdmin) {
      return true; // Si el usuario tiene el rol ADMIN, permite el acceso
    }

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    return user.profiles.some((profile) =>
      requiredProfiles.includes(profile.name),
    );
  }
}
