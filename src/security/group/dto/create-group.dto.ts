import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MaxLength } from 'class-validator';
import { validationMessageTypes } from '../../../common/constants/index';
import { CreateGroupPermissionDto } from '../../../database/DtoExternals/create-group_permission.dto';

export class CreateGroupDto {
  @ApiProperty({ example: 'Descripcion prueba' })
  @IsString({ message: validationMessageTypes.IS_STRING })
  @MaxLength(255)
  description: string;

  @ApiProperty({
    type: [CreateGroupPermissionDto],
  })
  @IsArray({ message: validationMessageTypes.IS_ARRAY })
  groupPermission: CreateGroupPermissionDto[];
}
