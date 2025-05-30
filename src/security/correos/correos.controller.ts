import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { CorreosService } from './correos.service';
import { CreateCorreoDto } from './dto/create-correo.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import { Maintenance } from '../auth/guard/maintenance.guard';
import { AllResponseFilter } from 'src/core/errors/all-exceptions.filter';
import { AuthWithProfiles } from '../auth/decorators/auth.decorator';
import { Profilee } from 'src/common/enums/profile.enum.ts';
import { Correo } from './entities/correo.entity';
import { FilterCorreoDto, ResponseCorreosDto } from './dto/filter-correo.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(Maintenance)
@ApiTags('Correos')
@Controller('correo')
export class CorreosController {
  constructor(private readonly correosService: CorreosService) {}

  @Post('create')
  @AuthWithProfiles([Profilee.ADMIN, Profilee.DIRECTOR, Profilee.USER], {
    create: true,
  })
  async create(
    @Body() data: CreateCorreoDto,
  ): Promise<Correo | AllResponseFilter> {
    return await this.correosService.create(data);
  }

  @Put('delete/:id')
  @AuthWithProfiles([Profilee.ADMIN, Profilee.DIRECTOR, Profilee.USER], {
    delete: true,
  })
  delete(@Param('id') id: number): Promise<Correo | AllResponseFilter> {
    return this.correosService.delete(id);
  }

  @Get('read')
  @AuthWithProfiles([Profilee.ADMIN], { read: true })
  @ApiQuery({ name: 'email', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  findTable(@Query() query: FilterCorreoDto): Promise<ResponseCorreosDto> {
    return this.correosService.findTable(query);
  }
}
