import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'root@gmail.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'V' })
  @IsString({ message: 'nationality debe ser una cadena de texto' })
  @IsOptional()
  nationality?: string;

  @ApiProperty({ example: 27498161 })
  @IsInt({ message: 'ci debe ser de tipo entero' })
  @IsOptional()
  ci?: number;

  @ApiProperty({ example: '04127116352' })
  @IsString({ message: 'phone debe ser de tipo cadena' })
  @Length(11, 11, { message: 'phone debe contener 11 dígitos' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 0 })
  @IsInt({ message: 'failedAttempts debe ser de tipo entero' })
  @IsOptional()
  failedAttempts?: number;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'isActive debe ser de tipo boleano' })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: '2000-08-25' })
  @IsString({ message: 'birthdate debe ser de tipo cadena' })
  @IsOptional()
  birthdate?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt({ message: 'profile debe ser de tipo entero' })
  @IsOptional()
  profile?: number;
}
