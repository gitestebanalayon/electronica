import { Injectable } from '@nestjs/common';
import { AllResponseFilter } from './core/errors/all-exceptions.filter';

@Injectable()
export class AppService {
  async getHello(): Promise<AllResponseFilter> {
    return await {
      statusCode: 200,
      message: '¡Servicio disponible!',
      timestamp: new Date().toISOString(),
      path: `/api/v1/service`,
      data: null,
    };
  }
}