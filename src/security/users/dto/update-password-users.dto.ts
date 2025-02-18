import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { validationMessageTypes } from '../../../common/constants/index';

export class UpdatePasswordUserDto {
  @ApiProperty({ example: '12345678' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsNotEmpty()
  @Length(8, 20, { message: validationMessageTypes.LENGTH_PASSWORD })
  @IsOptional()
  currentPassword?: string;

  @ApiProperty({ example: '12345678' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsNotEmpty()
  @Length(8, 20, { message: validationMessageTypes.LENGTH_PASSWORD })
  @IsOptional()
  password?: string;
}
