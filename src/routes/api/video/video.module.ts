import { Module } from '@nestjs/common';

import { VideoController } from '@app-routes/api/video/video.controller';
import { VideoSharedModule } from '@app-services/video/video.shared.module';

@Module({
    imports: [VideoSharedModule],
    controllers: [VideoController],
})
export class VideoModule {}
