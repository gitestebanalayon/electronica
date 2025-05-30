import { forwardRef, Module } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { CorreosController } from './correos.controller';
import { Correo } from './entities/correo.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Correo]),
    forwardRef(() => AuthModule), // Usar forwardRef aquí si es necesario en dependencias circulares
    UsersModule,
  ],
  providers: [CorreosService],
  exports: [CorreosService, TypeOrmModule],
  controllers: [CorreosController],
})
export class CorreosModule {}
