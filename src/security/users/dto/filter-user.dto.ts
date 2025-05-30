import { IsNumber, IsOptional, IsString } from 'class-validator';
import Users from '../entities/users.entity';
import { Type } from 'class-transformer';
import { validationMessageTypes } from '../../../common/constants/index';

export class FilterUserDto {
  @IsOptional()
  @IsString({ message: validationMessageTypes.IS_STRING })
  username?: string;

  // @IsOptional()
  // @IsEmail({}, { message: validationMessageTypes.IS_EMAIL })
  // email?: string;

  @IsOptional()
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
  @Type(() => Number)
  take?: number;
}

export class ResponseUsersDto {
  data: (Users & {
    group_description: { id: number; name: string };
  })[];
  totalData: number;
  totalPages: number;
  currentPage: number;
}
