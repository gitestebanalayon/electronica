import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateUsuarioPerfilDto {
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsInt()
  @IsNotEmpty()
  profileId: number;
}
