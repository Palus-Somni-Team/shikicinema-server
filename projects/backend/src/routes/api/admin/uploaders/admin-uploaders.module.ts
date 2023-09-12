import { Module } from '@nestjs/common';

import { AdminUploadersController } from '~backend/routes/api/admin/uploaders/admin-uploaders.controller';
import { UploaderSharedModule } from '~backend/services/uploader/uploader.shared.module';
import { UserSharedModule } from '~backend/services/user/user.shared.module';

@Module({
    imports: [UploaderSharedModule, UserSharedModule],
    controllers: [AdminUploadersController],
})
export class AdminUploadersModule {}
