import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersServices } from './users.service';
import { UsuariosController } from './users.controller';

import Users from './entities/users.entity';
import Profiles from '../profiles/entities/profiles.entity';

import { ProfilesModule } from '../profiles/profiles.module'; // Importa el módulo que proporciona ProfilesRepository
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Profiles]), // Asegúrar de que ambas entidades estén registradas en TypeORM
    forwardRef(() => AuthModule), // Usa forwardRef para evitar dependencias circulares
    ProfilesModule, // Importa el módulo que contiene ProfilesService o ProfilesRepository
  ],
  controllers: [UsuariosController],
  providers: [UsersServices],
  exports: [UsersServices, TypeOrmModule], // Exporta UsuariosService y TypeOrmModule para su uso en otros módulos
})
export class UsersModule {}
