import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ModulesModule } from './modules/modules.module';
import { PermissionsModule } from './permissions/permission.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';

import { DatabaseModule } from './database/database.module';

import databaseConfig from './common/config/database.config';
import swaggerConfig from './common/config/swagger.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/errors/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, swaggerConfig],
    }),
    DatabaseModule,
    UsersModule,
    ProfilesModule,
    PermissionsModule,
    ModulesModule,
    AuthModule,
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