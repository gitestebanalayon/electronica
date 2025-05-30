import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { validationMessageTypes } from 'src/common/constants';

export class CreateCorreoDto {
  @ApiProperty({ example: 'estebanalayon7@gmail.com' })
  @IsEmail({}, { message: validationMessageTypes.IS_EMAIL })
  @IsNotEmpty()
  email: string;
}
