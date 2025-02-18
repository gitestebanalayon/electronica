import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';
import Group from './entities/group.entity';
import { FilterGroupDto, ResponseGroupTableDto } from './dto/filter-group.dto';
import { AllResponseFilter } from '../../core/errors/all-exceptions.filter';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import { AuthWithProfiles } from '../auth/decorators/auth.decorator';
import { Profilee } from '../../common/enums/profile.enum.ts';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  @AuthWithProfiles([Profilee.ADMIN], { create: true })
  create(
    @Body() data: CreateGroupDto,
    @Req() request: Request,
  ): Promise<Group | AllResponseFilter> {
    return this.groupService.create(data, request);
  }

  @Get('read')
  @AuthWithProfiles([Profilee.ADMIN], { read: true })
  @ApiQuery({ name: 'description', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  findTable(@Query() query: FilterGroupDto): Promise<ResponseGroupTableDto> {
    return this.groupService.findTable(query);
  }

  @Get('filter/:id')
  @AuthWithProfiles([Profilee.ADMIN], { read: true })
  findOne(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Group | AllResponseFilter> {
    return this.groupService.findOne(id, request);
  }

  @Patch('update/:id')
  @AuthWithProfiles([Profilee.ADMIN], { update: true })
  update(
    @Param('id') id: number,
    @Body() data: UpdateGroupDto,
    @Req() request: Request,
  ): Promise<Group | AllResponseFilter> {
    return this.groupService.update(id, data, request);
  }

  @Put('delete/:id')
  @AuthWithProfiles([Profilee.ADMIN], { delete: true })
  delete(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Group | AllResponseFilter> {
    return this.groupService.delete(id, request);
  }
}
