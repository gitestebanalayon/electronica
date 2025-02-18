import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import { validationMessageTypes } from 'src/common/constants';

export class FilterUserDto {
  @ApiProperty({ example: 'estebanalayon7@gmail.com' })
  @IsEmail({}, { message: validationMessageTypes.IS_EMAIL })
  @IsNotEmpty({ message: 'no puede estar vacio' })
  email: string;

  @ApiProperty({ example: 27498161 })
  @IsNotEmpty({ message: 'no puede estar vacio' })
  ci: number;

  @ApiProperty({ description: 'Fecha de nacimiento', example: '2000-08-25' })
  @IsDateString({}, { message: validationMessageTypes.IS_DATE })
  @IsNotEmpty({ message: 'no puede estar vacio' })
  birthdate: Date;
}
