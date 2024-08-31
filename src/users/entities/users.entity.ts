import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Profiles from '../../profiles/entities/profiles.entity';
import { Exclude } from 'class-transformer';

@Entity('users', { schema: 'security' })
export default class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', length: 30, unique: true })
  email: string;

  @Column('varchar', { name: 'nationality', length: 1 })
  nationality: string;

  @Exclude()
  @Column('varchar', { name: 'password' })
  @Exclude()
  password: string;

  @Column('varchar', { name: 'ci', length: 8, unique: true })
  ci: number;

  @Column('varchar', { name: 'phone', length: 11 })
  phone: string;

  @Column('integer', { name: 'failedAttempts', default: 0 })
  failedAttempts: number;

  @Column('boolean', { name: 'isActive', default: true })
  isActive: boolean;

  @Column('boolean', { name: 'isDelete', default: false })
  isDelete: boolean;

  @Column('varchar', { name: 'birthdate', length: 10 })
  birthdate: string;

  @ManyToOne(() => Profiles, (profile) => profile.users, { nullable: true })
  @JoinColumn([{ name: 'profileId', referencedColumnName: 'id' }])
  profile: Profiles;
}
