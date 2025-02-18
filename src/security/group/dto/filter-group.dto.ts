import { IsNumber, IsOptional, IsString } from 'class-validator';
import Group from '../entities/group.entity';
import { Type } from 'class-transformer';
import { validationMessageTypes } from '../../../common/constants/index';

export class FilterGroupDto {
  @IsOptional()
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsString({ message: validationMessageTypes.IS_STRING })
  description?: string;
}

export class ResponseGroupTableDto {
  data: Group[];
  totalData: number;
  totalPages: number;
  currentPage: number;
}
