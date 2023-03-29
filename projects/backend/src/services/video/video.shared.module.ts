import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploaderSharedModule } from '~backend/services/uploader/uploader.shared.module';
import { VideoEntity } from '~backend/entities';
import { VideoService } from '~backend/services/video/video.service';

@Module({
    imports: [
        UploaderSharedModule,
        TypeOrmModule.forFeature([VideoEntity]),
    ],
    providers: [
        VideoService,
    ],
    exports: [VideoService],
})
export class VideoSharedModule {}
