import { forwardRef, Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Group from './entities/group.entity';
import GroupPermission from '../../database/entitysExternals/groupPermission.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupPermission]),
    forwardRef(() => AuthModule), // Usar forwardRef aquí si es necesario en dependencias circulares
    UsersModule,
  ],
  providers: [GroupService],
  exports: [GroupService, TypeOrmModule],
  controllers: [GroupController],
})
export class GroupModule {}
