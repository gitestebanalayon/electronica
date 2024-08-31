import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import Permissions from '../entities/permissions.entity';

export class FilterPermissionDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ResponsePermissionTableDto {
  data: Permissions[];
  totalData: number;
  totalPages: number;
  currentPage: number;
}
