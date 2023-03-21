import { Module } from '@nestjs/common';

import { AdminVideoController } from '~backend/routes/api/admin/video/admin-video.controller';
import { UserSharedModule } from '~backend/services/user/user.shared.module';
import { VideoSharedModule } from '~backend/services/video/video.shared.module';

@Module({
    imports: [
        VideoSharedModule,
        UserSharedModule,
    ],
    controllers: [AdminVideoController],
})
export class AdminVideoModule {}
