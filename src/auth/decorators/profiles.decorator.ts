import { SetMetadata } from '@nestjs/common';

export const PROFILES_KEY = 'profiles'; //Recomendado usar

// Cambia el tipo a string[]
// Esto se comunicará con el guard de profiles.guard.ts
export const Profile = (...profiles: string[]): MethodDecorator =>
  SetMetadata(PROFILES_KEY, profiles);
