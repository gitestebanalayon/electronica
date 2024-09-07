import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        //host: process.env.DATABASE_HOST,
        //port: Number(process.env.DATABASE_PORT),
        //username: process.env.DATABASE_USER,
        //password: process.env.DATABASE_PASSWORD,
        //database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
    }),
  ],
})
export class DatabaseModule {}

