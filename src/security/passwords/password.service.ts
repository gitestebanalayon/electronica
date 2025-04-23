import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import {
  validationMessageGroup,
  validationMessageServer,
} from '../../common/constants/index';
import Group from './entities/password.entity';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from '../../core/errors/all-exceptions.filter';
import GroupPermission from '../../database/entitysExternals/groupPermission.entity';
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
  ) { }

  @UseFilters(AllExceptionsFilter)
  async create(data: CreatePasswordDto){
  }
}
