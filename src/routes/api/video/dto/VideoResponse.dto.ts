import { Expose } from 'class-transformer';
import { Video, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';
import { VideoEntity } from '@app-entities';

export class VideoResponse implements Video {
    @Expose()
    animeId: number;

    @Expose()
    author: string;

    @Expose()
    domain: string;

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

    constructor(entity: VideoEntity) {
        this.animeId = entity.animeId;
        this.author = entity.author;
        this.domain = new URL(entity.url).hostname;
        this.episode = entity.episode;
        this.kind = entity.kind;
        this.language = entity.language;
        this.quality = entity.quality;
        this.uploader = entity.uploader?.shikimoriId;
        this.url = entity.url;
        this.watchesCount = entity.watchesCount;
    }
}
