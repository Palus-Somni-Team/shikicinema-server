import { Expose } from 'class-transformer';
import { IsEnum, IsISO31661Alpha2, IsInt, IsString, IsUrl, Length, Min } from 'class-validator';
import { CreateVideoRequest as Request, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';

export class CreateVideoRequest implements Request {
    @Expose()
    @IsString()
    @Length(5, 2048)
    @IsUrl()
    url: string;

    @Expose()
    @IsInt()
    @Min(0)
    animeId: number;

    @Expose()
    @IsInt()
    @Min(1)
    episode: number;

    @Expose()
    @IsEnum(VideoKindEnum)
    kind: VideoKindEnum;

    @Expose()
    @IsISO31661Alpha2()
    language: string;

    @Expose()
    @IsEnum(VideoQualityEnum)
    quality: VideoQualityEnum;

    @Expose()
    @IsString()
    @Length(1, 256)
    author: string;
}
