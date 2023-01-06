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

    constructor(
        id: number,
        animeId: number,
        author: Author,
        episode: number,
        kind: VideoKindEnum,
        language: string,
        quality: VideoQualityEnum,
        uploader: UploaderInfo,
        url: string,
        watchesCount: number,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.animeId = animeId;
        this.author = author;
        this.episode = episode;
        this.kind = kind;
        this.language = language;
        this.quality = quality;
        this.uploader = uploader;
        this.url = url;
        this.watchesCount = watchesCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static create(entity: VideoEntity): VideoResponse {
        const author = entity.author === null ? null : Author.create(entity.author);
        const uploader = entity.uploader === null ? null : UploaderInfo.create(entity.uploader);

        return new VideoResponse(
            entity.id,
            entity.animeId,
            author,
            entity.episode,
            entity.kind,
            entity.language,
            entity.quality,
            uploader,
            entity.url,
            entity.watchesCount,
            entity.createdAt,
            entity.updatedAt,
        );
    }
}
