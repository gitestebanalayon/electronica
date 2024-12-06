import { Exclude } from 'class-transformer';
import Users from '../../users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import GroupPermission from '../../../database/entitysExternals/groupPermission.entity';

@Entity('group', /*{ schema: 'security' }*/)
export default class Group {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'description',
    length: 255,
  })
  description: string;

  @Column('boolean', { name: 'is_deleted', default: false })
  is_deleted: boolean;

  @OneToMany(() => GroupPermission, (groupPermission) => groupPermission.group)
  groupPermission: GroupPermission[];

  @OneToMany(() => Users, (users) => users.group_description, {
    nullable: true,
  })
  users: Users[];

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
