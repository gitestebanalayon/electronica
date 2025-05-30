import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GroupModule } from './security/group/group.module';
import { UsersModule } from './security/users/users.module';
import { AuthModule } from './security/auth/auth.module';

import { DatabaseModule } from './database/database.module';

import databaseConfig from './common/config/database.config';
import swaggerConfig from './common/config/swagger.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/errors/all-exceptions.filter';
import { PasswordModule } from './security/passwords/password.module';
import { CorreosModule } from './security/correos/correos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, swaggerConfig],
    }),

    // Security
    DatabaseModule,
    UsersModule,
    GroupModule,
    PasswordModule,
    AuthModule,
    CorreosModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}
