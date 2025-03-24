import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersServices } from './users.service';
import { UsuariosController } from './users.controller';

import Users from './entities/users.entity';
import Group from '../group/entities/group.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import Password from '../passwords/entities/password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Group, Password]),
    EmailModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsuariosController],
  providers: [UsersServices],
  exports: [UsersServices, TypeOrmModule],
})
export class UsersModule { }
