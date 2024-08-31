import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import ProfilesModules from '../../database/entitysExternals/profilesModules.entity';
import PermissionsModules from '../../database/entitysExternals/permissionsModules.entity';

@Index('modules_pkey', ['id'], { unique: true })
@Entity('modules', { schema: 'security' })
export default class Modules {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @Column('character varying', { name: 'name', length: 255, unique: true })
  name: string;

  @Column('character varying', { name: 'path', length: 255, unique: true })
  path: string;

  @Column('text', { name: 'nameIcon', nullable: true })
  nameIcon: string | null; // Icono del módulo

  @Column('boolean', { name: 'isViewMenu', default: false })
  isViewMenu: boolean; // Indica si el módulo se debe mostrar en el menú

  @Column('boolean', { name: 'checked', default: false })
  checked: boolean; // Indica si el módulo está marcado como seleccionado

  @ManyToOne(() => Modules, (modules) => modules.modules)
  @JoinColumn([{ name: 'idSubModules', referencedColumnName: 'id' }])
  idSubModules: Modules; // Relación con submódulos

  @OneToMany(() => Modules, (modules) => modules.idSubModules)
  modules: Modules[]; // Relación con módulos secundarios

  @OneToMany(
    () => PermissionsModules,
    (permissionsModules) => permissionsModules.modules,
  )
  permissionsModules: PermissionsModules[]; // Relación con permisos

  @OneToMany(
    () => ProfilesModules,
    (profilesModules) => profilesModules.modules,
  )
  profilesModules: ProfilesModules[]; // Relación con perfiles
}
