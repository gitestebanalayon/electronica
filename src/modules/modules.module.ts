import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

// Entidades relacionadas con el módulo
import Modules from './entities/modules.entity';
import PermissionsModules from '../database/entitysExternals/permissionsModules.entity';
import ProfilesModules from '../database/entitysExternals/profilesModules.entity';
import Permissions from '../permissions/entities/permissions.entity';
import Profiles from '../profiles/entities/profiles.entity';

@Module({
  imports: [
    // Importar las entidades para el uso con TypeORM
    TypeOrmModule.forFeature([
      Modules,
      Permissions,
      Profiles,
      PermissionsModules,
      ProfilesModules,
    ]),
  ],
  providers: [ModulesService],
  controllers: [ModulesController],
  exports: [ModulesService, TypeOrmModule],
})
export class ModulesModule {}
