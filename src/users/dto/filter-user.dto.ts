import { IsNumber, IsOptional, IsString } from 'class-validator';
import Users from '../entities/users.entity';
import { Type } from 'class-transformer';

export class FilterUserDto {
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
  email?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Importante
  profile?: number;
}

export class ResponseUsersTableDto {
  data: (Users & { profile: { id: number; name: string } })[];
  totalData: number;
  totalPages: number;
  currentPage: number;
}
