import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Modules from './entities/modules.entity';
import { CreateModuleDto, DeleteModuleDto } from './dto/create-module.dto';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from 'src/core/errors/all-exceptions.filter';
import { validationMessageModules } from 'src/common/constants';
// import { promises } from 'dns';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Modules)
    private readonly modulesRepository: Repository<Modules>,
  ) {}

  @UseFilters(AllExceptionsFilter)
  async create(data: CreateModuleDto): Promise<AllResponseFilter> {
    let messageErrorModule: string;

    const existingUsers = await this.modulesRepository.findOne({
      where: [{ name: data.name }, { path: data.path }],
    });

    if (existingUsers) {
      if (existingUsers.name === data.name) {
        messageErrorModule = validationMessageModules.CREATE_CONFLICT.NAME;
      } else if (existingUsers.path === data.path) {
        messageErrorModule = validationMessageModules.CREATE_CONFLICT.PATH;
      }
      throw new ConflictException(messageErrorModule);
    }

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
          validationMessageModules.NOT_CONTENT.MODULE,
        );
      }
      module.idSubModules = subModule;
    }

    const savedModule = await this.modulesRepository.save(module);

    return {
      statusCode: HttpStatus.CREATED,
      message: validationMessageModules.CREATED,
      timestamp: new Date().toISOString(),
      path: `/api/v1/profiles`,
      data: savedModule,
    };
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
