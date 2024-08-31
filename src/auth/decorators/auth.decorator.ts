import { applyDecorators, UseGuards } from '@nestjs/common';
import { Profilee } from '../../common/enums/profile.enum.ts';
import { Profile } from './profiles.decorator';
import { JwtAuthGuard } from '../guard/auth.guard';
import { ProfilesGuard } from '../guard/profiles.guard';

// Modificar para asegurar que funciona tanto a nivel de clase como de método
export function AuthWithProfiles(...profiles: Profilee[]): MethodDecorator {
  return applyDecorators(
    // Aquí aplicamos el decorador personalizado Profile con los perfiles pasados como argumentos
    Profile(...profiles),
    // Luego aplicamos los guardias de autenticación y perfiles
    UseGuards(JwtAuthGuard, ProfilesGuard),
  );
}
