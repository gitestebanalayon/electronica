import { IsNumber, IsOptional, IsString } from 'class-validator';
import Profiles from '../entities/profiles.entity';
import { Type } from 'class-transformer';

export class FilterProfileDto {
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

export class ResponseProfilesTableDto {
  data: Profiles[];
  totalData: number;
  totalPages: number;
  currentPage: number;
}
