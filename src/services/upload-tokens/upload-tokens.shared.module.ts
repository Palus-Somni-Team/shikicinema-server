import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadTokenEntity, UploaderEntity } from '@app-entities';
import { UploadTokensService } from '@app-services/upload-tokens/upload-tokens.service';
import { UploaderService } from '@app-services/uploader/uploader.service';
import { UploaderSharedModule } from '@app-services/uploader/uploader.shared.module';
import { UserSharedModule } from '@app-services/user/user.shared.module';

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
