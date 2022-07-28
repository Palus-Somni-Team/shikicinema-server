import { Expose } from 'class-transformer';
import { IsEnum, IsISO31661Alpha2, IsInt, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { IsNonNullableOptional } from '@app-utils/class-validate.utils';
import { UpdateVideoRequest as Request, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';

export class UpdateVideoRequest implements Request {
    @Expose()
    @IsNonNullableOptional()
    @IsString()
    @Length(5, 2048)
    url?: string;

    @Expose()
    @IsInt()
    @Min(0)
    @IsNonNullableOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    animeId?: number;

    @Expose()
    @IsInt()
    @Min(1)
    @IsNonNullableOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    episode?: number;

    @Expose()
    @IsNonNullableOptional()
    @IsEnum(VideoKindEnum)
    kind?: VideoKindEnum;

    @Expose()
    @IsOptional()
    @IsISO31661Alpha2()
    language?: string;

    @Expose()
    @IsNonNullableOptional()
    @IsEnum(VideoQualityEnum)
    quality?: VideoQualityEnum;

    @Expose()
    @IsOptional()
    @IsString()
    author?: string | null;

    @Expose()
    @IsNonNullableOptional()
    @IsInt()
    @Min(0)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    watchesCount?: number;
}
