import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleDto } from './create-module.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class DeleteModuleDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isDelete: boolean;
}
