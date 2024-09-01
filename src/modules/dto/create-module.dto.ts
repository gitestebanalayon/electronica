import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsInt,
} from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ example: 'Home', description: 'Nombre del módulo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Descripción de Home',
    description: 'Descripción del módulo',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '/home', description: 'Ruta del módulo' })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({
    example: 'icon-home',
    description: 'Nombre del icono del módulo',
  })
  @IsOptional()
  @IsString()
  nameIcon?: string;

  @ApiProperty({ example: true, description: 'Visibilidad o estado del menú ' })
  @IsBoolean()
  isViewMenu: boolean;

  @ApiProperty({ example: false, description: 'Indica si está seleccionado' })
  @IsBoolean()
  checked: boolean;

  @ApiProperty({
    example: null,
    description: 'ID de los submódulos',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  idSubModules?: number;
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
