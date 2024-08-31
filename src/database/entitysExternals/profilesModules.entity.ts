import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Modules from '../../modules/entities/modules.entity';
import Profiles from '../../profiles/entities/profiles.entity';

@Index('profiles_modules_pkey', ['id'], { unique: true })
@Entity('profiles_modules', { schema: 'security' })
export default class ProfilesModules {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => Modules, (modules) => modules.profilesModules)
  @JoinColumn([{ name: 'modules_id', referencedColumnName: 'id' }])
  modules: Modules;

  @ManyToOne(() => Profiles, (profiles) => profiles.profilesModules)
  @JoinColumn([{ name: 'profiles_id', referencedColumnName: 'id' }])
  profiles: Profiles;
}
