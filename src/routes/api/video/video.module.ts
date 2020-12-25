import { Module } from '@nestjs/common';

import { VideoController } from './video.controller';
import { VideoSharedModule } from '../../../services/video/video.shared.module';

@Module({
    imports: [VideoSharedModule],
    controllers: [VideoController],
})
export class VideoModule {}
