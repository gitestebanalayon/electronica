import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
import { UpdatePasswordUserDto } from './dto/update-password-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Maintenance } from '../auth/guard/maintenance.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(Maintenance)
@ApiTags('Account')
@Controller('account')
export class UsuariosController {
  constructor(private readonly usersServices: UsersServices) { }

  @Post('create')
  @AuthWithProfiles([Profilee.ADMIN], { create: true })
  create(@Body() data: CreateUserDto): Promise<Users | AllResponseFilter> {
    return this.usersServices.create(data);
  }

  @Get('read')
  @AuthWithProfiles([Profilee.ADMIN], { read: true })
  @ApiQuery({ name: 'username', type: 'string', required: false })
  @ApiQuery({ name: 'email', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  findTable(@Query() query: FilterUserDto): Promise<ResponseUsersDto> {
    return this.usersServices.findTable(query);
  }

  @Get('filter:id')
  @AuthWithProfiles([Profilee.ADMIN], { read: true })
  findOne(@Param('id') id: number): Promise<Users | AllResponseFilter> {
    return this.usersServices.findOne(id);
  }

  @Patch('update/:id')
  @AuthWithProfiles([Profilee.ADMIN], { update: true })
  async updateUser(
    @Param('id') userId: number,
    @Body() data: UpdateUserDto,
  ): Promise<Users | AllResponseFilter> {
    return this.usersServices.updateUser(userId, data);
  }

  @Put('is_active/:id')
  @AuthWithProfiles([Profilee.ADMIN], { delete: true })
  isActiveUser(@Param('id') id: number): Promise<Users | AllResponseFilter> {
    return this.usersServices.isActive(id);
  }

  @Put('is_staff/:id')
  @AuthWithProfiles([Profilee.ADMIN], { update: true })
  isStaffUser(@Param('id') id: number): Promise<Users | AllResponseFilter> {
    return this.usersServices.isStaff(id);
  }

  @Put('is_root/:id')
  @AuthWithProfiles([Profilee.ADMIN], { update: true })
  isRootUser(@Param('id') id: number): Promise<Users | AllResponseFilter> {
    return this.usersServices.isRoot(id);
  }

  // Todos los roles pueden cambiar su contraseña
  @Put('update/password')
  @AuthWithProfiles([Profilee.ADMIN, Profilee.DIRECTOR, Profilee.USER], {
    update: true,
  })
  async changePassword(
    @Body() data: UpdatePasswordUserDto,
  ): Promise<Users | AllResponseFilter> {
    return this.usersServices.changePassword(data);
  }

  // Todos los roles pueden filtrar su perfil
  @Get('filter/profile')
  @AuthWithProfiles([Profilee.ADMIN, Profilee.DIRECTOR, Profilee.USER], {
    read: true,
  })
  filterAccountData(): Promise<Users | AllResponseFilter> {
    return this.usersServices.filterAccountData();
  }

  // @ApiQuery({
  //   name: 'id',
  //   required: false,
  //   description: 'No es necesario enviar el id',
  //   type: Number,
  // })


  @Put('update/profile')
  @AuthWithProfiles([Profilee.ADMIN, Profilee.DIRECTOR, Profilee.USER], {
    update: true,
  })
  async updateProfile(
    @Body() data: UpdateProfileDto,
  ): Promise<Users | AllResponseFilter> {
    return this.usersServices.updateProfile(data);
  }
}
