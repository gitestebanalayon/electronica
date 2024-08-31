import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Profiles from './entities/profiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profiles])],
  providers: [ProfilesService],
  exports: [TypeOrmModule], // Asegúrar de exportar el servicio
  controllers: [ProfilesController],
})
export class ProfilesModule {}
