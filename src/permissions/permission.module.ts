import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permission.service';
import { PermisosController } from './permission.controller';

import Permissions from './entities/permissions.entity';
import PermissionsModules from '../database/entitysExternals/permissionsModules.entity';
import ProfilesPermissions from '../database/entitysExternals/profilesPermissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permissions,
      PermissionsModules,
      ProfilesPermissions,
    ]),
  ],
  controllers: [PermisosController],
  providers: [PermissionsService],
  exports: [TypeOrmModule],
})
export class PermissionsModule {}
