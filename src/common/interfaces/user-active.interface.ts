// Esta sería la interface que estaba en auth controller, pero ya no está ahí

export interface ActiveUserInterface {
  email: string;
  groupId: string;
  classId: number[]; // Agregamos el classId aquí también
}
