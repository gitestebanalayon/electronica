import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PasswordService } from './password.service';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import { AuthWithProfiles } from '../auth/decorators/auth.decorator';
import { Profilee } from '../../common/enums/profile.enum.ts';
import { CreatePasswordDto } from './dto/create-password.dto';
import Password from './entities/password.entity';
import { AllResponseFilter } from 'src/core/errors/all-exceptions.filter';
import { Maintenance } from '../auth/guard/maintenance.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(Maintenance)
@ApiTags('Password')
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('create')
  @AuthWithProfiles([Profilee.ADMIN], { create: true })
  async create(
    @Body() data: CreatePasswordDto,
  ): Promise<Password | AllResponseFilter> {
    return await this.passwordService.create(data);
  }

  // @Get('read')
  // @AuthWithProfiles([Profilee.ADMIN], { read: true })
  // @ApiQuery({ name: 'description', type: 'string', required: false })
  // @ApiQuery({ name: 'page', type: 'number', required: false })
  // @ApiQuery({ name: 'take', type: 'number', required: false })
  // findTable(@Query() query: FilterPasswordDto): Promise<ResponsePasswordTableDto> {
  //   return this.passwordService.findTable(query);
  // }

  // @Get('filter/:id')
  // @AuthWithProfiles([Profilee.ADMIN], { read: true })
  // findOne(@Param('id') id: number): Promise<Password | AllResponseFilter> {
  //   return this.passwordService.findOne(id);
  // }

  // @Patch('update/:id')
  // @AuthWithProfiles([Profilee.ADMIN], { update: true })
  // update(
  //   @Param('id') id: number,
  //   @Body() data: UpdatePasswordDto,
  // ): Promise<Password | AllResponseFilter> {
  //   return this.passwordService.update(id, data);
  // }

  // @Put('delete/:id')
  // @AuthWithProfiles([Profilee.ADMIN], { delete: true })
  // delete(@Param('id') id: number): Promise<Password | AllResponseFilter> {
  //   return this.passwordService.delete(id);
  // }
}
