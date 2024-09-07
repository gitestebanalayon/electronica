import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import PermissionsModules from '../../database/entitysExternals/permissionsModules.entity';
import ProfilesPermissions from '../../database/entitysExternals/profilesPermissions.entity';

@Index('permissions_pkey', ['id'], { unique: true })
@Entity('permissions')
export default class Permissions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @Column('character varying', { name: 'name', length: 255, unique: true })
  name: string;

  @Column('boolean', { name: 'isDelete', default: false })
  isDelete: boolean;

  @OneToMany(
    () => PermissionsModules,
    (permissionsModules) => permissionsModules.permissions,
  )
  permissionsModules: PermissionsModules;

  @OneToMany(
    () => ProfilesPermissions,
    (profilesPermissions) => profilesPermissions.permissions,
  )
  profilesPermissions: ProfilesPermissions;

  @CreateDateColumn({ type: 'timestamp', name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updatedAt' })
  updatedAt: Date;
}
