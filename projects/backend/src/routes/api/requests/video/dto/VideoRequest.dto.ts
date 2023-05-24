import { ApiProperty } from '@nestjs/swagger';
import { Author } from '~backend/routes/api/author/dto';
import { Expose, Type } from 'class-transformer';
import {
    VideoRequest as Interface,
    VideoKindEnum,
    VideoQualityEnum,
    VideoRequestStatusEnum,
    VideoRequestTypeEnum,
} from '@shikicinema/types';
import { UserInfo } from '~backend/routes/api/user/dto';
import { VideoRequestEntity } from '~backend/entities';
import { VideoResponse } from '~backend/routes/api/video/dto';

export class VideoRequest implements Interface {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty({ enum: VideoRequestTypeEnum })
    type: VideoRequestTypeEnum;

    @Expose()
    @ApiProperty({ enum: VideoRequestStatusEnum })
    status: VideoRequestStatusEnum;

    @Expose()
    @ApiProperty()
    episode: number;

    @Expose()
    @ApiProperty({ enum: VideoKindEnum })
    kind: VideoKindEnum;

    @Expose()
    @ApiProperty({ enum: VideoQualityEnum })
    quality: VideoQualityEnum;

    @Expose()
    @ApiProperty()
    language: string;

    @Expose()
    @ApiProperty()
    comment: string;

    @Expose()
    @ApiProperty()
    reviewerComment: string;

    @Expose()
    @ApiProperty()
    @Type(() => Date)
    createdAt: Date;

    @Expose()
    @ApiProperty()
    @Type(() => Date)
    updatedAt: Date;

    @Expose()
    @ApiProperty()
    @Type(() => VideoResponse)
    video: VideoResponse;

    @Expose()
    @ApiProperty()
    @Type(() => Author)
    author: Author;

    @Expose()
    @ApiProperty()
    @Type(() => UserInfo)
    createdBy: UserInfo;

    @Expose()
    @ApiProperty()
    @Type(() => UserInfo)
    reviewedBy: UserInfo;

    constructor(entity?: VideoRequestEntity) {
        if (!entity) return;

        this.id = entity.id;
        this.type = entity.type;
        this.status = entity.status;
        this.episode = entity.episode;
        this.kind = entity.kind;
        this.quality = entity.quality;
        this.language = entity.language;
        this.comment = entity.comment;
        this.reviewerComment = entity.reviewerComment;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
        this.video = new VideoResponse(entity.video);
        this.author = entity.author ? new Author(entity.author) : null;
        this.createdBy = new UserInfo(entity.createdBy);
        this.reviewedBy = entity.reviewedBy ? new UserInfo(entity.reviewedBy) : null;
    }
}
