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
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permission.service';
import Permissions from './entities/permissions.entity';
import { AllResponseFilter } from 'src/core/errors/all-exceptions.filter';
import {
  FilterPermissionDto,
  ResponsePermissionTableDto,
} from './dto/filter-permission.dto';

@ApiTags('Permissions')
@Controller('/api/v1/permissions')
export class PermisosController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Post()
  async create(
    @Body() data: CreatePermissionDto,
  ): Promise<Permissions | AllResponseFilter> {
    return await this.permissionService.create(data);
  }

  @Get()
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'description', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  async findTable(
    @Query() query: FilterPermissionDto,
  ): Promise<ResponsePermissionTableDto> {
    return await this.permissionService.findTable(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<Permissions | AllResponseFilter> {
    return await this.permissionService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdatePermissionDto,
  ): Promise<Permissions | AllResponseFilter> {
    return await this.permissionService.update(id, data);
  }

  // Eliminar nuevo
  @Put(':id')
  async delete(
    @Param('id') id: number,
  ): Promise<Permissions | AllResponseFilter> {
    return await this.permissionService.delete(id);
  }
}
