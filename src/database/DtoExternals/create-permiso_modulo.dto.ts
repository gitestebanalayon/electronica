import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePermisosModulosDto {
  @IsInt()
  @IsNotEmpty()
  permisoId: number;

  @IsInt()
  @IsNotEmpty()
  moduloId: number;
}

export class UpdatePermisosModulosDto extends PartialType(
  CreatePermisosModulosDto,
) {}
