import { Expose } from 'class-transformer';
import { Video, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';

export class VideoResponse implements Video {
    @Expose()
    id: number;

    @Expose()
    animeId: number;

    @Expose()
    author: string;

    @Expose()
    episode: number;

    @Expose()
    kind: VideoKindEnum;

    @Expose()
    language: string;

    @Expose()
    quality: VideoQualityEnum;

    @Expose()
    uploader: string;

    @Expose()
    url: string;

    @Expose()
    watchesCount: number;

    @Expose()
    createdAt: string;

    @Expose()
    updatedAt: string;
}
