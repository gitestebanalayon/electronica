import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

import { validationMessageTypes } from '../../../common/constants/index';

export class CreateUserDto {
  @ApiProperty({ example: 'esteban' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'esteban@gmail.com' })
  @IsEmail({}, { message: validationMessageTypes.IS_EMAIL })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'V', description: 'Nacionalidad de la persona' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @Length(1, 1, { message: validationMessageTypes.LENGTH_NATIONALITY })
  @IsNotEmpty({ message: validationMessageTypes.IS_NOT_EMPTY })
  origen: 'V' | 'E';

  @ApiProperty({
    example: 27498161, // Ejemplo de cédula
  })
  @IsNumber({}, { message: 'La cédula debe ser un número entero.' }) // Validar que sea un número entero
  @Min(100000, { message: 'La cédula debe tener al menos 6 dígitos.' }) // Mínimo 5 dígitos
  @Max(99999999, { message: 'La cédula debe tener un máximo de 8 dígitos.' }) // Máximo 9 dígitos
  @IsPositive({ message: 'La cédula debe ser un número positivo.' }) // Validar que sea un número positivo
  ci: number; // Mantener el tipo `number` para la cédula

  @ApiProperty({ example: 'Esteban' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Alayon' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 0 })
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  failed_attempts: number;

  @ApiProperty({ example: '2000-08-25' })
  @IsDateString({}, { message: validationMessageTypes.IS_DATE })
  birthdate: Date;

  @ApiProperty({ example: '04127116352' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @Length(11, 11, { message: validationMessageTypes.LENGTH_PHONE })
  phone: string;

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  group_description_id: number;
}
