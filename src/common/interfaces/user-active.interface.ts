// Esta sería la interface que estaba en auth controller, pero ya no está ahí

import Profiles from '../../profiles/entities/profiles.entity';

export interface ActiveUserInterface {
  email: string;
  profiles: Profiles[]; // Asegúrar de que Profiles tenga la propiedad `name`
}
