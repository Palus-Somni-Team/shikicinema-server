import { Module } from '@nestjs/common';
import { UploadTokensService } from './upload-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadTokenEntity } from './upload-token.entity';
import { PgSharedService } from '../postgres/postgres.service';
import { UploaderService } from '../uploader/uploader.service';
import { UploaderSharedModule } from '../uploader/uploader.shared.module';
import { PostgresSharedModule } from '../postgres/postgres.shared.module';
import { UploaderEntity } from '../uploader/uploader.entity';
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
