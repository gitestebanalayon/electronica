import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { validationMessageTypes } from '../../../common/constants/index';

export class CreatePasswordDto {
  @ApiProperty({ example: 'Descripcion prueba' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @MaxLength(255)
  description: string;

}
