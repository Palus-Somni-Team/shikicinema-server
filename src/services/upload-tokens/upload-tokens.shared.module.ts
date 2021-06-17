import { Module } from '@nestjs/common';
import { UploadTokensService } from './upload-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploaderEntity, UploadTokenEntity } from '@app-entities';
import { PgSharedService } from '../postgres/postgres.service';
import { UploaderService } from '../uploader/uploader.service';
import { UploaderSharedModule } from '../uploader/uploader.shared.module';
import { PostgresSharedModule } from '../postgres/postgres.shared.module';
import { UserSharedModule } from '../user/user.shared.module';

@Module({
  imports: [
    PostgresSharedModule,
    UserSharedModule,
    UploaderSharedModule,
    TypeOrmModule.forFeature([UploadTokenEntity, UploaderEntity])
  ],
  providers: [PgSharedService, UploaderService, UploadTokensService],
  exports: [UploadTokensService],
})
export class UploadTokensSharedModule {}
