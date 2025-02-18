import { Injectable } from '@nestjs/common';

interface Service {
  statusCode: number;
}

@Injectable()
export class AppService {
  async getHello(): Promise<Service> {
    return await {
      statusCode: 200,
    };
  }
}
