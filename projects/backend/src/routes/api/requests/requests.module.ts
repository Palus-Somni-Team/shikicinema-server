import { Module } from '@nestjs/common';
import { VideoRequestsModule } from '~backend/routes/api/requests/video/video-requests.module';

@Module({
    imports: [VideoRequestsModule],
})
export class RequestsModule { }
