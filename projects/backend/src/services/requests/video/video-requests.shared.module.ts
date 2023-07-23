import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoRequestEntity } from '~backend/entities';
import { VideoRequestService } from '~backend/services/requests/video/video-requests.service';

@Module({
    providers: [VideoRequestService],
    imports: [
        TypeOrmModule.forFeature([VideoRequestEntity]),
    ],
    exports: [VideoRequestService],
})
export class VideoRequestsSharedModule { }
