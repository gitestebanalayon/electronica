import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import Modules from './entities/modules.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from 'src/core/errors/all-exceptions.filter';
import { validationMessageModules } from 'src/common/constants';
import {
  FilterModuleDto,
  ResponseModulesTableDto,
} from './dto/filter-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
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

    const existingModule = await this.modulesRepository.findOne({
      where: [{ name: data.name }, { path: data.path }],
    });

    if (existingModule) {
      if (existingModule.name === data.name) {
        messageErrorModule = validationMessageModules.CREATE_CONFLICT.NAME;
      } else if (existingModule.path === data.path) {
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
      path: `/api/v1/modules`,
      data: savedModule,
    };
  }

  @UseFilters(AllExceptionsFilter)
  async findTable(query: FilterModuleDto): Promise<ResponseModulesTableDto> {
    let take = Number(query.take);
    const page = Number(query.page) || 1; // Establecer el valor por defecto de page en 1

    take = Math.max(1, take || 5); // Asegurar que take sea al menos 1

    const skip = (Math.max(1, page || 1) - 1) * take;

    const where: FindOptionsWhere<Modules> = {
      isDelete: false,
    };

    if (query.name) {
      where.name = ILike(`%${query.name}%`); // Filtrar por email
    }

    const [data, totalData] = await this.modulesRepository.findAndCount({
      where,
      take,
      skip,
      order: { id: 'ASC' }, // Ordenar por Id
    });

    const totalPages = Math.ceil(totalData / take);

    if (data.length === 0) {
      throw new NotFoundException(validationMessageModules.NOT_CONTENT.MODULES);
    }

    return { data, totalData, totalPages, currentPage: page };
  }

  @UseFilters(AllExceptionsFilter)
  async findOne(id: number): Promise<Modules | AllResponseFilter> {
    const module = await this.modulesRepository.findOneBy({ id });

    if (!module) {
      throw new NotFoundException(validationMessageModules.NOT_CONTENT.MODULE);
    }

    return {
      statusCode: HttpStatus.OK,
      message: validationMessageModules.OK.CONTENT,
      timestamp: new Date().toISOString(),
      path: `/api/v1/modules/${id}`,
      data: module,
    };
  }

  @UseFilters(AllExceptionsFilter)
  async update(
    id: number,
    data: UpdateModuleDto,
  ): Promise<Modules | AllResponseFilter> {
    const module = await this.modulesRepository.findOneBy({
      id,
    });

    if (!module) {
      throw new NotFoundException(validationMessageModules.NOT_CONTENT.MODULE);
    }

    Object.assign(module, data);

    try {
      await this.modulesRepository.save(module);

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageModules.OK.UPDATE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/modules/${id}`,
        data: await this.modulesRepository.findOneBy({ id }),
      };
    } catch (error) {
      switch (error.length) {
        case 231:
          throw new ConflictException(
            'El nombre del módulo ya se encuentra en uso con otro permiso, por favor intenta otro nombre',
          );
      }
    }
  }

  // Eliminar nuevo
  @UseFilters(AllExceptionsFilter)
  async delete(id: number): Promise<Modules | AllResponseFilter> {
    const existingPermission = await this.modulesRepository.findOneBy({
      id,
    });

    if (!existingPermission) {
      throw new NotFoundException(validationMessageModules.NOT_CONTENT.MODULE);
    }

    const isDelete = !existingPermission.isDelete;
    await this.modulesRepository.update(id, {
      isDelete: isDelete,
    });

    if (isDelete) {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageModules.OK.DELETE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/modules/${id}`,
        data: { isDelete }, // Retornar el nuevo valor de isDelete
      };
    } else {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageModules.OK.RESTORE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/modules/${id}`,
        data: { isDelete }, // Retornar el nuevo valor de isDelete
      };
    }
  }
}
