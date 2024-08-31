import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'Editar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Description Editar' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class DeletePermissionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;
}
