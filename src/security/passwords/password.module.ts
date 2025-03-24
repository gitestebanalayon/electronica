import { forwardRef, Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import Password from './entities/password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Password]),
    forwardRef(() => AuthModule), // Usar forwardRef aquí si es necesario en dependencias circulares
    UsersModule,
  ],
  providers: [PasswordService],
  exports: [PasswordService, TypeOrmModule],
  controllers: [PasswordController],
})
export class PasswordModule { }
