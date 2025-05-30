import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Group from '../../group/entities/group.entity';
import Password from 'src/security/passwords/entities/password.entity';
import { Correo } from 'src/security/correos/entities/correo.entity';

@Entity('user', { schema: 'security' })
export default class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'code', length: 9 })
  code: string;

  @Column('varchar', { name: 'username', length: 30 })
  username: string;

  // @Column('varchar', { name: 'email', length: 100 })
  // email: string;

  @Column('character', { name: 'nationality', length: 1 })
  origen: 'V' | 'E'; // Restricción de valores

  @Column({ name: 'ci' })
  ci: number;

  @Column('varchar', { name: 'first_name', length: 100 })
  first_name: string;

  @Column('varchar', { name: 'last_name', length: 100 })
  last_name: string;

  // @Column('varchar', { name: 'password' })
  // @Exclude()
  // password: string;

  @OneToMany(() => Password, (password) => password.users, {
    nullable: true,
  })
  password_id: Password;

  @OneToMany(() => Correo, (gmail) => gmail.users, {
    nullable: true,
  })
  gmail_id: Correo[];

  @Column({ type: 'timestamp', nullable: true })
  lastPasswordChange: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastCorreoChange: Date;

  @Column('boolean', { name: 'is_locked', default: false })
  is_locked: boolean;

  @Column('integer', { name: 'failed_attempts', default: 0 })
  failed_attempts: number;

  @Column({ name: 'birthdate', type: 'date' })
  birthdate: Date;

  @Column('varchar', { name: 'phone', length: 11 })
  phone: string;

  @Column('boolean', { name: 'is_active', default: true })
  is_active: boolean;

  @Column('boolean', { name: 'is_staff', default: false })
  is_staff: boolean;

  @Column('boolean', { name: 'is_root', default: false })
  is_root: boolean;

  @Column('varchar', { name: 'recovery_code', length: 255, nullable: true })
  recovery_code: string;

  @ManyToOne(() => Group, (group_description) => group_description.users, {
    nullable: true,
  })
  @JoinColumn([{ name: 'group_description_id', referencedColumnName: 'id' }])
  group_description: Group;
}
