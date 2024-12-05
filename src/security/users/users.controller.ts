import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UsersServices } from './users.service';
import { FilterUserDto, ResponseUsersDto } from './dto/filter-user.dto';
import { AllResponseFilter } from 'src/core/errors/all-exceptions.filter';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import { AuthWithProfiles } from '../auth/decorators/auth.decorator';
import { Profilee } from '../../common/enums/profile.enum.ts';
import Users from './entities/users.entity';
import { Request } from 'express';

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsuariosController {
  constructor(private readonly usersServices: UsersServices) {}

  @Post('create')
  //@AuthWithProfiles([Profilee.ADMIN], { create: true })
  create(
    @Body() data: CreateUserDto,
    @Req() request: Request
  ): Promise<Users | AllResponseFilter> {
    return this.usersServices.create(data, request);
  }

  @Get('read')
  //@AuthWithProfiles([Profilee.ADMIN], { read: true })
  @ApiQuery({ name: 'username', type: 'string', required: false })
  @ApiQuery({ name: 'email', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  findTable(@Query() query: FilterUserDto, @Req() request: Request): Promise<ResponseUsersDto> {
    return this.usersServices.findTable(query);
  }

  @Get('filter:id')
  //@AuthWithProfiles([Profilee.ADMIN], { read: true })
  findOne(@Param('id') id: number, @Req() request: Request): Promise<Users | AllResponseFilter> {
    return this.usersServices.findOne(id, request);
  }

  @Patch('update/:id')
  //@AuthWithProfiles([Profilee.ADMIN], { update: true })
  async updateUser(
    @Param('id') userId: number,
    @Body() data: UpdateUserDto,
    @Req() request: Request
  ): Promise<Users | AllResponseFilter> {
    return this.usersServices.updateUser(userId, data, request);
  }
 
  @Put('is_active/:id')
  //@AuthWithProfiles([Profilee.ADMIN], { delete: true })
  isActiveUser(
    @Param('id') id: number,
    @Req() request: Request
  ): Promise<Users | AllResponseFilter> {
    return this.usersServices.isActive(id, request);
  }

  @Put('is_staff/:id')
  //@AuthWithProfiles([Profilee.ADMIN], { update: true })
  isStaffUser(
    @Param('id') id: number,
    @Req() request: Request
  ): Promise<Users | AllResponseFilter> {
    return this.usersServices.isStaff(id, request);
  }

  @Put('is_root/:id')
  //@AuthWithProfiles([Profilee.ADMIN], { update: true })
  isRootUser(
    @Param('id') id: number,
    @Req() request: Request
  ): Promise<Users | AllResponseFilter> {
    return this.usersServices.isRoot(id, request);
  }

}
