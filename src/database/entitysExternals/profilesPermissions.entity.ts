import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Permissions from '../../permissions/entities/permissions.entity';
import Profiles from '../../profiles/entities/profiles.entity';

@Index('UQ_profiles_permissions_unique', ['permissionsId', 'profilesId'], {
  unique: true,
})
@Entity('profiles_permissions', { schema: 'security' })
export default class ProfilesPermissions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'permissions_id', nullable: true })
  permissionsId: number | null;

  @Column('integer', { name: 'profiles_id', nullable: true })
  profilesId: number | null;

  @ManyToOne(
    () => Permissions,
    (permissions) => permissions.profilesPermissions,
  )
  @JoinColumn([{ name: 'permissions_id', referencedColumnName: 'id' }])
  permissions: Permissions;

  @ManyToOne(() => Profiles, (profiles) => profiles.profilesPermissions)
  @JoinColumn([{ name: 'profiles_id', referencedColumnName: 'id' }])
  profiles: Profiles;
}
