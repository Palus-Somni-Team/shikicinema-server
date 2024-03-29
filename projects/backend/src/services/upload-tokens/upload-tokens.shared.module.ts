import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadTokenEntity, UploaderEntity } from '~backend/entities';
import { UploadTokensService } from '~backend/services/upload-tokens/upload-tokens.service';
import { UploaderService } from '~backend/services/uploader/uploader.service';
import { UploaderSharedModule } from '~backend/services/uploader/uploader.shared.module';
import { UserSharedModule } from '~backend/services/user/user.shared.module';

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
