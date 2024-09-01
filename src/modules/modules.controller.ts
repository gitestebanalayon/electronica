import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateModuleDto } from './dto/create-module.dto';
import Modules from './entities/modules.entity';
import { ModulesService } from './modules.service';
import { AllResponseFilter } from 'src/core/errors/all-exceptions.filter';

@ApiTags('Modules')
@Controller('modules')
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
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos.',
    type: [Modules],
  })
  async findAll(): Promise<Modules[]> {
    return this.modulesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Módulo encontrado.',
    type: Modules,
  })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Modules> {
    const module = await this.modulesService.findOne(id);
    if (!module) {
      throw new NotFoundException(`Módulo con ID ${id} no encontrado.`);
    }
    return module;
  }

  // Eliminar nuevo

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Módulo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.modulesService.remove(id);
    if (!result) {
      throw new NotFoundException(`Módulo con ID ${id} no encontrado.`);
    }
  }
}
