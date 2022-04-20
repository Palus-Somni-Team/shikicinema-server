import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploaderSharedModule } from '@app-services/uploader/uploader.shared.module';
import { VideoEntity } from '@app-entities';
import { VideoService } from '@app-services/video/video.service';

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
