import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'root@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;

  @ApiProperty({ example: 'V' })
  @IsString()
  nationality: string;

  @ApiProperty({ example: 27498161 })
  @IsInt()
  ci: number;

  @ApiProperty({ example: '04127116352' })
  @IsString()
  @Length(11, 11)
  phone: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  failedAttempts: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: '2000-08-25' })
  @IsDateString()
  birthdate: Date;

  @ApiProperty({ example: 1 })
  @IsNumber()
  profile: number;
}

export class DeleteUserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;
}
