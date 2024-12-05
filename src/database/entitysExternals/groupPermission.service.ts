// group-permission.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import GroupPermission from './groupPermission.entity';

@Injectable()
export class GroupPermissionService {
  constructor(
    @InjectRepository(GroupPermission)
    private readonly groupPermissionRepository: Repository<GroupPermission>,
  ) {}

  async hasPermission(
    groupId: number,
    classId: number,
    action: string,
  ): Promise<boolean> {
    const permission = await this.groupPermissionRepository.findOne({
      where: {
        group_id: groupId,
      },
    });

    if (!permission) {
      return false; // Si no existe el permiso
    }

    switch (action) {
      case 'create':
        return permission.create;
      case 'read':
        return permission.read;
      case 'update':
        return permission.update;
      case 'delete':
        return permission.delete;
      default:
        return false;
    }
  }
}
