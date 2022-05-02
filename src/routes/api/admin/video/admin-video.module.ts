import { Module } from '@nestjs/common';

import { AdminVideoController } from '@app-routes/api/admin/video/admin-video.controller';
import { UserSharedModule } from '@app-services/user/user.shared.module';
import { VideoSharedModule } from '@app-services/video/video.shared.module';

@Module({
    imports: [
        VideoSharedModule,
        UserSharedModule,
    ],
    controllers: [AdminVideoController],
})
export class AdminVideoModule {}
