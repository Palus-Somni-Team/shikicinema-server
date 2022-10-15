import { ApiProperty } from '@nestjs/swagger';
import { Author } from '@app-routes/api/author/dto/Author.dto';
import { Expose } from 'class-transformer';
import { Uploader } from '@app-routes/api/video/dto/Uploader.dto';
import { Video, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';

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
    @ApiProperty({ type: () => Uploader })
    uploader: Uploader;

    @Expose()
    @ApiProperty()
    url: string;

    @Expose()
    @ApiProperty()
    watchesCount: number;

    @Expose()
    @ApiProperty({ format: 'date-time' })
    createdAt: string;

    @Expose()
    @ApiProperty({ format: 'date-time' })
    updatedAt: string;
}
