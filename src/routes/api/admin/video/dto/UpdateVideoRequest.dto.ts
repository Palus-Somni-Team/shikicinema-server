import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import { UpdateVideoRequest as Request, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';

export class UpdateVideoRequest implements Request {
    @Expose()
    @IsOptional()
    @IsString()
    @Length(5, 256)
    url?: string;

    @Expose()
    @IsOptional()
    @IsInt()
    animeId: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1)
    episode: number;

    @Expose()
    kind?: VideoKindEnum;

    @Expose()
    @IsOptional()
    @IsString()
    @Length(3, 16)
    language?: string;

    @Expose()
    quality?: VideoQualityEnum;

    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    author?: string;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    watchesCount?: number;
}
