import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleDto } from './create-module.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'ID de los submódulos, opcional' })
  idSubModules?: number; // ID en lugar de entidad completa
}
