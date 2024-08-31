import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

import { ApiOkResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: "Returns 'Hello World'" })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
