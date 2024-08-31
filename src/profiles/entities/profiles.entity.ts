import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import ProfilesModules from '../../database/entitysExternals/profilesModules.entity';
import ProfilesPermissions from '../../database/entitysExternals/profilesPermissions.entity';
import Users from 'src/users/entities/users.entity';

@Entity('profiles', { schema: 'security' })
export default class Profiles {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', length: 255, unique: true })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @Column('boolean', { name: 'isDelete', default: false })
  isDelete: boolean;

  @OneToMany(
    () => ProfilesModules,
    (profilesModules) => profilesModules.profiles,
  )
  profilesModules: ProfilesModules[];

  @OneToMany(
    () => ProfilesPermissions,
    (profilesPermissions) => profilesPermissions.profiles,
  )
  profilesPermissions: ProfilesPermissions[];

  @OneToMany(() => Users, (user) => user.profile, { nullable: true })
  users: Users[];
}
