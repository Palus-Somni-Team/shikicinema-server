import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '@app-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgSharedService } from '../postgres/postgres.service';

@Module({
  providers: [UserService, PgSharedService],
  imports: [PgSharedService, TypeOrmModule.forFeature([UserEntity])],
  exports: [UserService],
})
export class UserSharedModule {}
