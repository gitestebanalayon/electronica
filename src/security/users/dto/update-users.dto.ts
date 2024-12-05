import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { validationMessageTypes } from '../../../common/constants/index';

export class UpdateUserDto {
  @ApiProperty({ example: 'V27498161' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsOptional()
  code?: string;

  @ApiProperty({ example: 'esteban' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'esteban@gmail.com' })
  @IsEmail({}, { message: validationMessageTypes.IS_EMAIL })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Origen de la persona', example: 'V'})
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsOptional()
  origen?: 'V' | 'E';

  @ApiProperty({ example: 27498161 })
  @IsInt({ message: 'La cédula debe ser un número entero.' }) // Validar que sea un número entero
  @Min(10000, { message: 'La cédula debe tener al menos 5 dígitos.' }) // Mínimo 5 dígitos
  @Max(999999999, { message: 'La cédula debe tener un máximo de 9 dígitos.' }) // Máximo 9 dígitos
  @IsPositive({ message: 'La cédula debe ser un número positivo.' }) // Validar que sea un número positivo
  @IsOptional()
  ci?: number;

  @ApiProperty({ example: 'Esteban' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsOptional()
  first_name?: string;

  @ApiProperty({ example: 'Alayon' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsOptional()
  last_name?: string;

  // @ApiProperty({ example: '12345678' })
  // @IsString({ message: validationMessageTypes.IS_STRING })
  // @IsNotEmpty()
  // @Length(8, 20, { message: validationMessageTypes.LENGTH_PASSWORD })
  // @IsOptional()
  // password?: string;

  @ApiProperty({ example: 0 })
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  @IsOptional()
  failed_attempts?: number;

  @ApiProperty({ description: 'Fecha de nacimiento', example: '2000-08-25' })
  @IsOptional()
  @IsDateString({}, { message: validationMessageTypes.IS_DATE })
  birthdate?: Date;

  @ApiProperty({ example: '04127116352' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsOptional()
  phone?: string;

  @IsBoolean({ message: validationMessageTypes.IS_BOOLEAN })
  @ApiProperty()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty()
  @IsBoolean({ message: validationMessageTypes.IS_BOOLEAN })
  @IsOptional()
  is_staff?: boolean;

  @ApiProperty()
  @IsBoolean({ message: validationMessageTypes.IS_BOOLEAN })
  @IsOptional()
  is_root?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional() // Permite que el campo sea opcional
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  @Transform(({ value }) => Number(value)) // Convierte el valor a número
  group_description_id: number; // IDs de los perfiles asociados al usuario
}
