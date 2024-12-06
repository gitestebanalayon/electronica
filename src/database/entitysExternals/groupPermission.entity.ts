import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Group from '../../security/group/entities/group.entity';

@Index('UQ_group_permission_unique', ['group_id'], {
  unique: true,
})
@Entity('group_permission', /*{ schema: 'security' }*/)
export default class GroupPermission {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'group_id', nullable: true })
  group_id: number | null;

  @Column('boolean', { name: 'create', default: false })
  create: boolean;

  @Column('boolean', { name: 'read', default: false })
  read: boolean;

  @Column('boolean', { name: 'update', default: false })
  update: boolean;

  @Column('boolean', { name: 'delete', default: false })
  delete: boolean;

  @ManyToOne(() => Group, (group) => group.groupPermission)
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'id' }])
  group: Group;
}
