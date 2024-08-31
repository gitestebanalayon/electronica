import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProfilesModulosDto {
  @IsInt()
  @IsNotEmpty()
  profileId: number;

  @IsInt()
  @IsNotEmpty()
  moduloId: number;
}
