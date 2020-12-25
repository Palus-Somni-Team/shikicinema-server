import { AdminVideoController } from './admin-video.controller';
import { Module } from '@nestjs/common';

import { UserSharedModule } from '../../../../services/user/user.shared.module';
import { VideoSharedModule } from '../../../../services/video/video.shared.module';

@Module({
    imports: [
        VideoSharedModule,
        UserSharedModule,
    ],
    controllers: [AdminVideoController],
})
export class AdminVideoModule {}
