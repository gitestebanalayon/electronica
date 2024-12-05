import { Module } from '@nestjs/common';
import { GroupPermissionService } from './groupPermission.service';

// group-permission.module.ts
@Module({
  providers: [GroupPermissionService],
  exports: [GroupPermissionService], // Exporta el servicio para que otros módulos lo utilicen
})
export class GroupPermissionModule {}
