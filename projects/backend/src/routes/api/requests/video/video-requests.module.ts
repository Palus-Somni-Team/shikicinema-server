import { Module } from '@nestjs/common';

import { VideoRequestsController } from '~backend/routes/api/requests/video/video-requests.controller';
import { VideoRequestsSharedModule } from '~backend/services/requests/video/video-requests.shared.module';

@Module({
    imports: [VideoRequestsSharedModule],
    controllers: [VideoRequestsController],
})
export class VideoRequestsModule { }
