import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, } from 'class-validator';
import { validationMessageTypes } from '../../../common/constants/index';

export class ActiveCorreoUserDto {
    @ApiProperty({ example: 2 })
    @IsNumber({}, { message: validationMessageTypes.IS_NUMBER })
    @IsNotEmpty()
    id: number;
}
