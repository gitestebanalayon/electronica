import { IsEmail, IsNumber, IsOptional } from 'class-validator';

import { Type } from 'class-transformer';
import { validationMessageTypes } from '../../../common/constants/index';
export class FilterCorreoDto {
  @IsOptional()
  @IsEmail({}, { message: validationMessageTypes.IS_EMAIL })
  email?: string;

  @IsOptional()
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  @Type(() => Number)
  take?: number;
}

export class ResponseCorreosDto {
  data: object;
  totalData: number;
  totalPages: number;
  currentPage: number;
}
