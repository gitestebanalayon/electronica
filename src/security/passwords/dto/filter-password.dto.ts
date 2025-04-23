import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { validationMessageTypes } from '../../../common/constants/index';
import Password from '../entities/password.entity';

export class FilterPasswordDto {
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

export class ResponsePasswordTableDto {
  data: Password[];
  totalData: number;
  totalPages: number;
  currentPage: number;
}
