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
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateModuleDto } from './dto/create-module.dto';
import Modules from './entities/modules.entity';
import { ModulesService } from './modules.service';
import { AllResponseFilter } from 'src/core/errors/all-exceptions.filter';
import {
  FilterModuleDto,
  ResponseModulesTableDto,
} from './dto/filter-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@ApiTags('Modules')
@Controller('/api/v1/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Módulo creado exitosamente.',
    type: Modules,
  })
  @ApiResponse({ status: 400, description: 'Error en la creación del módulo.' })
  async create(
    @Body() data: CreateModuleDto,
  ): Promise<Modules | AllResponseFilter> {
    return await this.modulesService.create(data);
  }

  @Get()
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  async findTable(
    @Query() query: FilterModuleDto,
  ): Promise<ResponseModulesTableDto> {
    return await this.modulesService.findTable(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Modules | AllResponseFilter> {
    return await this.modulesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateModuleDto,
  ): Promise<Modules | AllResponseFilter> {
    return await this.modulesService.update(id, data);
  }

  @Put(':id')
  async delete(@Param('id') id: number): Promise<Modules | AllResponseFilter> {
    return await this.modulesService.delete(id);
  }
}
