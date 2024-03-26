import { AuthorSharedModule } from '~backend/services/author/author.shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoRequestEntity } from '~backend/entities';
import { VideoRequestService } from '~backend/services/requests/video/video-requests.service';

@Module({
    providers: [VideoRequestService],
    imports: [
        AuthorSharedModule,
        TypeOrmModule.forFeature([VideoRequestEntity]),
    ],
    exports: [VideoRequestService],
})
export class VideoRequestsSharedModule { }
