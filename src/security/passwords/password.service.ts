import { HttpStatus, Inject, Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from '../../core/errors/all-exceptions.filter';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import Password from './entities/password.entity';
import { CreatePasswordDto } from './dto/create-password.dto';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,

    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @UseFilters(AllExceptionsFilter)
  async create(data: CreatePasswordDto): Promise<Password | AllResponseFilter> {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Contraseña creada con éxito.',
      timestamp: new Date().toISOString(),
      path: this.request.url,
      data: data,
    };
  }
}
