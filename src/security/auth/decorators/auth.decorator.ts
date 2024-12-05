import { applyDecorators, UseGuards } from '@nestjs/common';
import { Profilee } from '../../../common/enums/profile.enum.ts'; // Asegúrate de que el archivo sea correcto
import { JwtAuthGuard } from '../guard/auth.guard';
import { ProfilesGuard } from '../guard/profiles.guard';
import { AuthWithProfilesClass as ProfilesMetadata } from './profiles.decorator'; // Importa el nuevo decorador

export function AuthWithProfiles(
  groupId: Profilee[],
  permissions: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
  } = {},
): ClassDecorator & MethodDecorator {
  return (target: object, propertyKey?: string | symbol) => {
    // Usar el decorador consolidado para establecer metadatos
    ProfilesMetadata(groupId, permissions)(
      target,
      propertyKey,
      Object.getOwnPropertyDescriptor(target, propertyKey)!,
    );

    // Aplicar los guards
    applyDecorators(UseGuards(JwtAuthGuard, ProfilesGuard))(
      target,
      propertyKey,
      Object.getOwnPropertyDescriptor(target, propertyKey)!,
    );
  };
}
