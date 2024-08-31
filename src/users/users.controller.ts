import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UsersServices } from './users.service';
import { FilterUserDto, ResponseUsersTableDto } from './dto/filter-user.dto';
import Users from './entities/users.entity';
import { AllResponseFilter } from 'src/core/errors/all-exceptions.filter';

@ApiTags('Users')
@Controller('/api/v1/users')
export class UsuariosController {
  constructor(private readonly usersServices: UsersServices) {}

  @Post()
  async create(
    @Body() data: CreateUserDto,
  ): Promise<Users | AllResponseFilter> {
    return await this.usersServices.create(data);
  }

  @Get()
  @ApiQuery({ name: 'email', type: 'string', required: false })
  @ApiQuery({ name: 'profile', type: 'number', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  async findTable(
    @Query() query: FilterUserDto,
  ): Promise<ResponseUsersTableDto> {
    return await this.usersServices.findTable(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Users | AllResponseFilter> {
    return await this.usersServices.findOne(id);
  }

  // Actualizando usuario
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() data: UpdateUserDto,
  ): Promise<Users | AllResponseFilter> {
    return await this.usersServices.updateUser(id, data);
  }

  @Put('isActive/:id')
  async isActiveUser(
    @Param('id') id: number,
  ): Promise<UserDto | AllResponseFilter> {
    return await this.usersServices.isActive(id);
  }

  @Put('isDelete/:id')
  async isDelete(
    @Param('id') id: number,
  ): Promise<UserDto | AllResponseFilter> {
    return await this.usersServices.isDelete(id);
  }
}
