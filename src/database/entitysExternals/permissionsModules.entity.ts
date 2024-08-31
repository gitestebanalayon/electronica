import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Modules from '../../modules/entities/modules.entity';
import Permissions from '../../permissions/entities/permissions.entity';

@Index('UQ_permissions_modules_unique', ['modulesId', 'permissionsId'], {
  unique: true,
})
@Entity('permissions_modules', { schema: 'security' })
export default class PermissionsModules {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'modules_id', nullable: true })
  modulesId: number | null;

  @Column('integer', { name: 'permissions_id', nullable: true })
  permissionsId: number | null;

  @ManyToOne(() => Modules, (modules) => modules.permissionsModules)
  @JoinColumn([{ name: 'modules_id', referencedColumnName: 'id' }])
  modules: Modules;

  @ManyToOne(() => Permissions, (permissions) => permissions.permissionsModules)
  @JoinColumn([{ name: 'permissions_id', referencedColumnName: 'id' }])
  permissions: Permissions;
}
