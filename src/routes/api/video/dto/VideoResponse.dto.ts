import { ApiProperty } from '@nestjs/swagger';
import { Author } from '@app-routes/api/author/dto/Author.dto';
import { Expose } from 'class-transformer';
import { UploaderInfo } from '@app-routes/auth/dto';
import { Video, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';
import { VideoEntity } from '@app-entities';

export class VideoResponse implements Video {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    animeId: number;

    @Expose()
    @ApiProperty()
    author: Author;

    @Expose()
    @ApiProperty()
    episode: number;

    @Expose()
    @ApiProperty({ enum: VideoKindEnum })
    kind: VideoKindEnum;

    @Expose()
    @ApiProperty()
    language: string;

    @Expose()
    @ApiProperty({ enum: VideoQualityEnum })
    quality: VideoQualityEnum;

    @Expose()
    @ApiProperty({ type: () => UploaderInfo })
    uploader: UploaderInfo;

    @Expose()
    @ApiProperty()
    url: string;

    @Expose()
    @ApiProperty()
    watchesCount: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(entity: VideoEntity) {
        const {
            id,
            animeId,
            episode,
            kind,
            language,
            quality,
            url,
            watchesCount,
            createdAt,
            updatedAt,
            author: authorEntity,
            uploader: uploaderEntity,
        } = entity;

        this.id = id;
        this.animeId = animeId;
        this.author = authorEntity ? new Author(authorEntity) : null;
        this.episode = episode;
        this.kind = kind;
        this.language = language;
        this.quality = quality;
        this.uploader = uploaderEntity ? new UploaderInfo(uploaderEntity) : null;
        this.url = url;
        this.watchesCount = watchesCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
