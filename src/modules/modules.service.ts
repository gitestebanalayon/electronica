import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Modules from './entities/modules.entity';
import { CreateModuleDto, DeleteModuleDto } from './dto/create-module.dto';
// import { promises } from 'dns';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Modules)
    private readonly modulesRepository: Repository<Modules>,
  ) {}

  async create(data: CreateModuleDto): Promise<Modules> {
    const module = new Modules();

    module.name = data.name;
    module.description = data.description;
    module.path = data.path;
    module.nameIcon = data.nameIcon;
    module.isViewMenu = data.isViewMenu;
    module.checked = data.checked;

    // Convertir idSubModule en referencia si está definido
    if (data.idSubModules) {
      const subModule = await this.modulesRepository.findOne({
        where: { id: data.idSubModules },
      });
      if (!subModule) {
        throw new NotFoundException(
          `Modulo con ID ${data.idSubModules} no encontrado`,
        );
      }
      module.idSubModules = subModule;
    }

    // Guardar el nuevo módulo
    return this.modulesRepository.save(module);
  }

  async findAll(): Promise<Modules[]> {
    return this.modulesRepository.find({
      // relations: {
      //   idSubModules: true,
      // },
    });
  }

  async findOne(id: number): Promise<Modules> {
    const module = await this.modulesRepository.findOne({
      where: { id },
      // relations: {
      //   idSubModules: true,

      // },
    });

    if (!module) {
      throw new NotFoundException(`Modulo con ID ${id} no encontrado`);
    }

    return module;
  }

  async remove(id: number): Promise<DeleteModuleDto> {
    try {
      const modules = await this.modulesRepository.findOne({
        where: { id: id },
      });

      if (!modules) {
        throw new NotFoundException(`Modulo con ID ${id} no encontrado`);
      }

      await this.modulesRepository.delete(modules);
      return new DeleteModuleDto(modules.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          `Error al eliminar el modulo con ID ${id}: ${error.message}`,
        );
      }
    }
  }
}
