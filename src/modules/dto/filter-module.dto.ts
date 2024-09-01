import { IsNumber, IsOptional, IsString } from 'class-validator';
import Modules from '../entities/modules.entity';
import { Type } from 'class-transformer';

export class FilterModuleDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Importante
  take?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Importante
  page?: number;

  @IsOptional()
  @IsString()
  name?: string;
}

export class ResponseModulesTableDto {
  data: Modules[];
  totalData: number;
  totalPages: number;
  currentPage: number;
}
