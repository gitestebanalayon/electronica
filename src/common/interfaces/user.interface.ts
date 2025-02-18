// src/auth/interfaces/user.interface.ts

//import Profiles from "../..//profiles/entities/profiles.entity";

export interface AuthenticatedUser2 {
  id: number;
  email: string;
  groupId: string;
  classId: number[];
}
