import { PartialType } from '@nestjs/mapped-types';
import { CreatePasswordDto } from './create-password.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { validationMessageTypes } from '../../../common/constants/index';

export class UpdatePasswordDto extends PartialType(CreatePasswordDto) {
  @ApiProperty()
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
