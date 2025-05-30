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

@Entity('correo', { schema: 'security' })
export class Correo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'gmail',
    length: 255,
  })
  gmail: string;

  @Column('boolean', { name: 'status', default: false })
  status: boolean;

  @Column('boolean', { name: 'is_deleted', default: false })
  is_deleted: boolean;

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

  @ManyToOne(() => Users, (users) => users.gmail_id)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: Users;
}
