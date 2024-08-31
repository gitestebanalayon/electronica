import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class ProfilesDTO {
  @ApiProperty({ example: 'Descripcion prueba' })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: 'Prueba' })
  @IsString()
  @MaxLength(255)
  name: string;
}

export class CreateProfileDto {
  @ApiProperty({ example: 'Prueba' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Descripcion prueba' })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isDelete: boolean;
}
