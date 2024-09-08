import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

import { ApiOkResponse } from '@nestjs/swagger';
import { AllResponseFilter } from './core/errors/all-exceptions.filter';

@ApiTags('Service')
@Controller('/service')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: "¡Servicio disponible!" })
  @Get()
  async getHello(): Promise<AllResponseFilter> {
    return await this.appService.getHello();
  }
}