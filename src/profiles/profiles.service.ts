import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { validationMessageProfiles } from '../common/constants/index';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import Profiles from './entities/profiles.entity';
import {
  FilterProfileDto,
  ResponseProfilesTableDto,
} from './dto/filter-profile.dto';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from 'src/core/errors/all-exceptions.filter';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profiles)
    private readonly profilesRepository: Repository<Profiles>,
  ) {}

  @UseFilters(AllExceptionsFilter)
  async create(data: CreateProfileDto): Promise<AllResponseFilter> {
    const existingProfile = await this.profilesRepository.findOneBy({
      name: data.name,
    });

    if (existingProfile) {
      throw new ConflictException(
        validationMessageProfiles.CREATE_CONFLICT.NAME,
      );
    }

    const savedProfile = await this.profilesRepository.save(data);

    return {
      statusCode: HttpStatus.CREATED,
      message: validationMessageProfiles.CREATED,
      timestamp: new Date().toISOString(),
      path: `/api/v1/profiles`,
      data: savedProfile,
    };
  }

  @UseFilters(AllExceptionsFilter)
  async findTable(query: FilterProfileDto): Promise<ResponseProfilesTableDto> {
    let take = Number(query.take);
    const page = Number(query.page);

    take = Math.max(1, take || 5); // Asegurar que take sea al menos 1
    const skip = (Math.max(1, page || 1) - 1) * take;

    let where: FindOptionsWhere<Profiles> = {
      isDelete: false,
    };

    if (query.name) {
      where = {
        name: ILike(`%${query.name}%`),
      };
    }

    if (query.description) {
      where = {
        description: ILike(`%${query.description}%`),
      };
    }

    const [data, totalData] = await this.profilesRepository.findAndCount({
      where,
      take,
      skip,
      order: { id: 'ASC' },
    });
    const totalPages = Math.ceil(totalData / take);

    if (data.length === 0) {
      throw new NotFoundException(
        validationMessageProfiles.NOT_CONTENT.PROFILES,
      );
    }

    return { data, totalData, totalPages, currentPage: query.page || 1 };
  }

  @UseFilters(AllExceptionsFilter)
  async findOne(id: number): Promise<Profiles | AllResponseFilter> {
    const profile = await this.profilesRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException(
        validationMessageProfiles.NOT_CONTENT.PROFILE,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: validationMessageProfiles.OK.CONTENT,
      timestamp: new Date().toISOString(),
      path: `/api/v1/profiles/${id}`,
      data: profile,
    };
  }

  @UseFilters(AllExceptionsFilter)
  async update(
    id: number,
    data: UpdateProfileDto,
  ): Promise<Profiles | AllResponseFilter> {
    const profile = await this.profilesRepository.findOneBy({ id });

    if (!profile) {
      throw new NotFoundException(
        validationMessageProfiles.NOT_CONTENT.PROFILE,
      );
    }

    Object.assign(profile, data);

    try {
      await this.profilesRepository.save(profile);

      return {
        statusCode: HttpStatus.OK,
        message: validationMessageProfiles.OK.UPDATE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/profiles/${id}`,
        data: await this.profilesRepository.findOneBy({ id }),
      };
    } catch (error) {
      switch (error.length) {
        case 232:
          throw new ConflictException(
            'El nombre del perfil ya se encuentra en uso con otro perfil, por favor intenta otro nombre',
          );
      }
    }
  }

  @UseFilters(AllExceptionsFilter)
  async delete(id: number): Promise<Profiles | AllResponseFilter> {
    const existingProfile = await this.profilesRepository.findOneBy({ id });

    if (!existingProfile) {
      throw new NotFoundException(
        validationMessageProfiles.NOT_CONTENT.PROFILE,
      );
    }

    const isDelete = !existingProfile.isDelete;
    await this.profilesRepository.update(id, {
      isDelete: isDelete,
    });

    if (isDelete) {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageProfiles.OK.DELETE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${id}`,
        data: { isDelete }, // Retornar el nuevo valor de isDelete
      };
    } else {
      return {
        statusCode: HttpStatus.OK,
        message: validationMessageProfiles.OK.RESTORE,
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${id}`,
        data: { isDelete }, // Retornar el nuevo valor de isDelete
      };
    }
  }
}
