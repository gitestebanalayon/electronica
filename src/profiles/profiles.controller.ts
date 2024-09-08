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
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import Profiles from './entities/profiles.entity';
import {
  FilterProfileDto,
  ResponseProfilesTableDto,
} from './dto/filter-profile.dto';
import { AllResponseFilter } from 'src/core/errors/all-exceptions.filter';

@ApiTags('Profiles')
@Controller('/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(
    @Body() data: CreateProfileDto,
  ): Promise<Profiles | AllResponseFilter> {
    return this.profilesService.create(data);
  }

  @Get()
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'description', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  findTable(
    @Query() query: FilterProfileDto,
  ): Promise<ResponseProfilesTableDto> {
    return this.profilesService.findTable(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Profiles | AllResponseFilter> {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: UpdateProfileDto,
  ): Promise<Profiles | AllResponseFilter> {
    return this.profilesService.update(id, data);
  }

  @Put(':id')
  delete(@Param('id') id: number): Promise<Profiles | AllResponseFilter> {
    return this.profilesService.delete(id);
  }
}
