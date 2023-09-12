import { Module } from '@nestjs/common';

import { AdminUploadersModule } from '~backend/routes/api/admin/uploaders/admin-uploaders.module';
import { AdminUserModule } from '~backend/routes/api/admin/user/admin-user.module';
import { AdminVideoModule } from '~backend/routes/api/admin/video/admin-video.module';

@Module({
    imports: [
        AdminUserModule,
        AdminVideoModule,
        AdminUploadersModule,
    ],
})
export class AdminModule {}
