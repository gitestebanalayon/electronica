import { Exclude } from 'class-transformer';
import Users from 'src/security/users/entities/users.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('password', { schema: 'security' })
export default class Password {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'password',
    length: 255,
  })
  password: string;

  @Column('boolean', { name: 'status', default: false })
  status: boolean;

  @Column('boolean', { name: 'is_deleted', default: false })
  is_deleted: boolean;

  @ManyToOne(() => Users, (users) => users.password_id)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: Users;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
