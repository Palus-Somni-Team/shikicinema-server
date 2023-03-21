import { Module } from '@nestjs/common';

import { VideoController } from '~backend/routes/api/video/video.controller';
import { VideoSharedModule } from '~backend/services/video/video.shared.module';

@Module({
    imports: [VideoSharedModule],
    controllers: [VideoController],
})
export class VideoModule {}
