import { Module } from '@nestjs/common';

import { UploaderSharedModule } from '~backend/services/uploader/uploader.shared.module';
import { UploadersController } from '~backend/routes/api/uploaders/uploaders.controller';

@Module({
    imports: [UploaderSharedModule],
    controllers: [UploadersController],
})
export class UploadersModule {}
