import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePermisosPerfilDto {
  @IsInt()
  @IsNotEmpty()
  permisoId: number;

  @IsInt()
  @IsNotEmpty()
  profileId: number;
}
