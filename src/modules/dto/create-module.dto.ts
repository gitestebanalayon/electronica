import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre del módulo' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Descripción del módulo' })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Ruta del módulo' })
  path: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Nombre del icono del módulo' })
  nameIcon?: string;

  @IsBoolean()
  @ApiProperty({ description: 'Visibilidad o estado del menú ' })
  isViewMenu: boolean;

  @IsBoolean()
  @ApiProperty({ description: 'Indica si está seleccionado' })
  checked: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'ID de los submódulos', required: false })
  idSubModules?: number; // Mantener ID como número
}

export class DeleteModuleDto {
  @ApiProperty({ example: 1, description: 'ID del módulo a eliminar' })
  @IsNumber()
  @IsPositive()
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
