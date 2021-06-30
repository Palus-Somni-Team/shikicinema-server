import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadTokenEntity, UploaderEntity } from '@app-entities';
import { UploadTokensService } from './upload-tokens.service';
import { UploaderService } from '../uploader/uploader.service';
import { UploaderSharedModule } from '../uploader/uploader.shared.module';
import { UserSharedModule } from '../user/user.shared.module';

@Module({
    imports: [
        UserSharedModule,
        UploaderSharedModule,
        TypeOrmModule.forFeature([UploadTokenEntity, UploaderEntity]),
    ],
    providers: [UploaderService, UploadTokensService],
    exports: [UploadTokensService],
})
export class UploadTokensSharedModule {}
