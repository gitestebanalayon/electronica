import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { validationMessageTypes } from '../../../common/constants/index';
import { CreateGroupPermissionDto } from '../../../database/DtoExternals/create-group_permission.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiProperty()
  @IsString({ message: validationMessageTypes.IS_STRING })
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: [CreateGroupPermissionDto],
  })
  @IsArray({ message: validationMessageTypes.IS_ARRAY })
  groupPermission: CreateGroupPermissionDto[];
}
