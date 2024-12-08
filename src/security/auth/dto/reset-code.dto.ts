import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsPositive, Max, Min } from 'class-validator';
import { validationMessageTypes } from 'src/common/constants';

export class RecoveryCodeDto {
    @ApiProperty({ example: 'esteban@gmail.com' })
    @IsEmail({}, { message: validationMessageTypes.IS_EMAIL })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 27498161 })
    @IsInt({ message: 'La cédula debe ser un número entero.' }) // Validar que sea un número entero
    @Min(10000, { message: 'La cédula debe tener al menos 5 dígitos.' }) // Mínimo 5 dígitos
    @Max(999999999, { message: 'La cédula debe tener un máximo de 9 dígitos.' }) // Máximo 9 dígitos
    @IsPositive({ message: 'La cédula debe ser un número positivo.' }) // Validar que sea un número positivo
    @IsNotEmpty()
    ci: number;

    @ApiProperty({ description: 'Fecha de nacimiento', example: '2000-08-25' })
    @IsDateString({}, { message: validationMessageTypes.IS_DATE })
    @IsNotEmpty()
    birthdate: Date;
}
