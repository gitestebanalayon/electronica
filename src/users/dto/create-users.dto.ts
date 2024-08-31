import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

import { ProfilesDTO } from 'src/profiles/dto/create-profile.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'test@gmail.com' })
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

  @ApiProperty({
    example: 28314770,
  })
  @IsInt()
  ci: number;

  @ApiProperty({ example: '04123917375' })
  @IsString()
  @Length(11, 11)
  phone: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  failedAttempts: number;

  @IsBoolean()
  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ example: '2000-08-01' })
  @IsString()
  birthdate: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  profile: number;
}

export class DeleteUserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;
}

export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: 'A' })
  nationality: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: '12345678' })
  ci: number;

  @ApiProperty({ example: '04123917375' })
  phone: string;

  @ApiProperty({ example: 0 })
  failedAttempts: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2000-01-01' })
  birthdate: string;

  @ApiProperty({ type: () => ProfilesDTO })
  profile?: ProfilesDTO;
}
