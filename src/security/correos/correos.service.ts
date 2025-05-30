import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { CreateCorreoDto } from './dto/create-correo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Correo } from './entities/correo.entity';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import {
  AllExceptionsFilter,
  AllResponseFilter,
} from 'src/core/errors/all-exceptions.filter';
import { REQUEST } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import Users from '../users/entities/users.entity';
import {
  validationMessageCorreo,
  validationMessageUser,
} from 'src/common/constants';
import { FilterCorreoDto, ResponseCorreosDto } from './dto/filter-correo.dto';

@Injectable()
export class CorreosService {
  constructor(
    @InjectRepository(Correo)
    private readonly correoRepository: Repository<Correo>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    private readonly dataSource: DataSource,

    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @UseFilters(AllExceptionsFilter)
  async create(data: CreateCorreoDto): Promise<Correo | AllResponseFilter> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Obtener el encabezado Authorization
      const authHeader = this.request.headers['authorization'];
      let decoded: JwtPayload;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7, authHeader.length); // Extraemos el token

        decoded = jwt.decode(token) as JwtPayload;
      } else {
        throw new UnauthorizedException(
          'No se ha proporcionado un token de autorización',
        );
      }

      // Buscar el usuario por ID
      const user = await this.usersRepository.findOne({
        where: { id: decoded.id },
      });

      // En caso de no existir el usuario
      if (!user) {
        throw new ConflictException(validationMessageUser.NOT_CONTENT.USER);
      }

      const verifyCorreo = await this.correoRepository.findOne({
        where: { gmail: data.email },
      });

      if (verifyCorreo) {
        throw new ConflictException(validationMessageCorreo.CONFLICT.EMAIL);
      }

      // Crear el correo
      const newCorreo = new Correo();
      newCorreo.gmail = data.email;
      newCorreo.users = user;

      const createCorreo = await queryRunner.manager.save(newCorreo);
      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Correo creado con éxito.',
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: {
          email: createCorreo.gmail,
        },
      };
    } catch (error) {
      console.log(error);

      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  @UseFilters(AllExceptionsFilter)
  async delete(id: number): Promise<Correo | AllResponseFilter> {
    try {
      const existingCorreo = await this.correoRepository.findOneBy({ id });

      if (!existingCorreo) {
        throw new NotFoundException(validationMessageCorreo.NOT_CONTENT.CORREO);
      }

      // Verificar si el grupo ya está marcado como eliminado
      if (existingCorreo.is_deleted) {
        throw new NotFoundException(validationMessageCorreo.NOT_OK.DENIED);
      }

      const is_deleted = !existingCorreo.is_deleted;
      const updateIsDelete = await this.correoRepository.update(id, {
        is_deleted: is_deleted,
      });

      if (updateIsDelete.affected >= 1) {
        const profile = await this.correoRepository.findOneBy({ id });

        return {
          statusCode: HttpStatus.OK,
          message: validationMessageCorreo.OK.DELETE,
          timestamp: new Date().toISOString(),
          path: this.request.url,
          data: profile,
        };
      }

      return {
        statusCode: HttpStatus.NOT_MODIFIED,
        message: validationMessageCorreo.NOT_OK.DELETE,
        timestamp: new Date().toISOString(),
        path: this.request.url,
        data: [],
      };
    } catch (error) {
      console.log(error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  @UseFilters(AllExceptionsFilter)
  async findTable(query: FilterCorreoDto): Promise<ResponseCorreosDto> {
    // Obtener el encabezado Authorization
    const authHeader = this.request.headers['authorization'];
    let decoded: JwtPayload;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7, authHeader.length); // Extraemos el token

      decoded = jwt.decode(token) as JwtPayload;
    } else {
      throw new UnauthorizedException(
        'No se ha proporcionado un token de autorización',
      );
    }

    console.log(decoded.id);

    // Configuración de paginación (comenzando desde página 1)
    const take = Math.max(1, Number(query.take) || 10); // Mínimo 1 registro por página
    const page = Math.max(1, Number(query.page) || 1); // Página mínima 1
    const skip = (page - 1) * take; // Ajuste para empezar desde página 1

    const where: FindOptionsWhere<Correo> = {
      is_deleted: false,
      users: { id: decoded.id },
    };

    if (query.email) {
      where.gmail = ILike(`%${query.email}%`); // Filtrar por email
    }

    const [data, totalData] = await this.correoRepository.findAndCount({
      where,
      take,
      skip,
      relations: ['users'],
      order: {
        status: 'DESC', // Primero los que tienen status = true (DESC porque true > false)
        id: 'ASC', // Luego ordenados por ID ascendente
      },
    });

    const totalPages = Math.ceil(totalData / take);

    return { data, totalData, totalPages, currentPage: page };
  }
}
