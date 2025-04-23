import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { Maintenance } from './security/auth/guard/maintenance.guard';

interface Service {
  statusCode: number;
}

@UseGuards(Maintenance)
@ApiTags('Service')
@Controller('/service')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: '¡Service available!' })
  @Get()
  async getHello(): Promise<Service> {
    return await this.appService.getHello();
  }
}
