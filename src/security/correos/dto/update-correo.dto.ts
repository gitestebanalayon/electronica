import { PartialType } from '@nestjs/mapped-types';
import { CreateCorreoDto } from './create-correo.dto';

export class UpdateCorreoDto extends PartialType(CreateCorreoDto) {}
