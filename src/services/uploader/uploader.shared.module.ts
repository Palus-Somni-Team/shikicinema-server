import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploaderEntity } from './uploader.entity';
import { PgSharedService } from '../postgres/postgres.service';
import { UserSharedModule } from '../user/user.shared.module';

@Module({
  imports: [
    PgSharedService,
    UserSharedModule,
    TypeOrmModule.forFeature([UploaderEntity])
  ],
  providers: [PgSharedService, UploaderService],
  exports: [UploaderService],
})
export class UploaderSharedModule {}
