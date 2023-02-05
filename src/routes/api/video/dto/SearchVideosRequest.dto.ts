import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
    IsEnum,
    IsISO31661Alpha2,
    IsInt,
    IsOptional,
    Max,
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
export class SearchVideosRequest implements PaginationRequest, Partial<Omit<Video, 'uploader' | 'author'>> {
    @Expose()
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ required: false })
    id?: number;

    @Expose()
    @IsInt()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({
        minimum: 0,
        required: false,
    })
    animeId?: number;

    @Expose()
    @IsOptional()
    @ApiProperty({ required: false })
    author?: string;

    @Expose()
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({
        minimum: 1,
        required: false,
    })
    episode?: number;

    @Expose()
    @IsEnum(VideoKindEnum)
    @IsOptional()
    @ApiProperty({
        enum: VideoKindEnum,
        required: false,
    })
    kind?: VideoKindEnum;

    @Expose()
    @IsISO31661Alpha2()
    @IsOptional()
    @ApiProperty({ required: false })
    language?: string;

    @Expose()
    @IsEnum(VideoQualityEnum)
    @IsOptional()
    @ApiProperty({
        enum: VideoQualityEnum,
        required: false,
    })
    quality?: VideoQualityEnum;

    @Expose()
    @IsOptional()
    @ApiProperty({ required: false })
    uploader?: string;

    @Expose()
    @IsInt()
    @IsOptional()
    @Max(100)
    @Type(() => Number)
    @ApiProperty({
        minimum: 1,
        required: false,
        maximum: 100,
    })
    limit?: number;

    @Expose()
    @IsInt()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({
        minimum: 0,
        required: false,
        default: 0,
    })
    offset?: number;
}
