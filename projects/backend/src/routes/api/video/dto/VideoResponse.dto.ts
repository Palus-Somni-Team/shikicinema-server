import { ApiProperty } from '@nestjs/swagger';
import { Author } from '~backend/routes/api/author/dto/Author.dto';
import { Expose, Type } from 'class-transformer';
import { UploaderInfo } from '~backend/routes/auth/dto';
import { Video, VideoKindEnum, VideoQualityEnum } from '@shikicinema/types';
import { VideoEntity } from '~backend/entities';

export class VideoResponse implements Video {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    animeId: number;

    @Expose()
    @ApiProperty()
    @Type(() => Author)
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
    @Type(() => UploaderInfo)
    uploader: UploaderInfo;

    @Expose()
    @ApiProperty()
    url: string;

    @Expose()
    @ApiProperty()
    watchesCount: number;

    @ApiProperty()
    @Type(() => Date)
    createdAt: Date;

    @ApiProperty()
    @Type(() => Date)
    updatedAt: Date;

    constructor(entity?: VideoEntity) {
        if (!entity) return;

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
