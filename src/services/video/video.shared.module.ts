import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from '@app-entities';

import { UploaderSharedModule } from '../uploader/uploader.shared.module';
import { VideoService } from './video.service';

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
