import { Expose, Type } from 'class-transformer';
import {
    IsEnum,
    IsISO31661Alpha2,
    IsInt,
    IsOptional,
    Min,
} from 'class-validator';
import {
    PaginationRequest,
    Video,
    VideoKindEnum,
    VideoQualityEnum,
} from '@lib-shikicinema';

/**
 * Will validate if at least one of the fields present in query
 */
export class SearchVideosRequest implements PaginationRequest, Partial<Video> {
    @Expose()
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    id?: number;

    @Expose()
    @IsInt()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    animeId?: number;

    @Expose()
    @IsOptional()
    author?: string;

    @Expose()
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    episode?: number;

    @Expose()
    @IsEnum(VideoKindEnum)
    @IsOptional()
    kind?: VideoKindEnum;

    @Expose()
    @IsISO31661Alpha2()
    @IsOptional()
    language?: string;

    @Expose()
    @IsEnum(VideoQualityEnum)
    @IsOptional()
    quality?: VideoQualityEnum;

    @Expose()
    @IsOptional()
    uploader?: string;

    @Expose()
    @IsInt()
    @IsOptional()
    limit?: number;

    @Expose()
    @IsInt()
    @IsOptional()
    offset?: number;
}
