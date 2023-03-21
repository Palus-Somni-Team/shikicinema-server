import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsISO31661Alpha2, IsInt, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { IsNonNullableOptional } from '~backend/utils/class-validate.utils';
import { UpdateVideoRequest as Request, VideoKindEnum, VideoQualityEnum } from '@shikicinema/types';

export class UpdateVideoRequest implements Request {
    @Expose()
    @IsNonNullableOptional()
    @IsString()
    @Length(5, 2048)
    @ApiProperty({
        minLength: 5,
        maxLength: 2048,
    })
    url?: string;

    @Expose()
    @IsInt()
    @Min(0)
    @IsNonNullableOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @ApiProperty({ minimum: 0 })
    animeId?: number;

    @Expose()
    @IsInt()
    @Min(1)
    @IsNonNullableOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @ApiProperty({ minimum: 1 })
    episode?: number;

    @Expose()
    @IsNonNullableOptional()
    @IsEnum(VideoKindEnum)
    @ApiProperty({ enum: VideoKindEnum })
    kind?: VideoKindEnum;

    @Expose()
    @IsOptional()
    @IsISO31661Alpha2()
    @ApiProperty()
    language?: string;

    @Expose()
    @IsNonNullableOptional()
    @IsEnum(VideoQualityEnum)
    @ApiProperty({ enum: VideoQualityEnum })
    quality?: VideoQualityEnum;

    @Expose()
    @IsOptional()
    @IsString()
    @Length(1, 256)
    @ApiProperty({
        minLength: 1,
        maxLength: 256,
        nullable: true,
    })
    author?: string | null;

    @Expose()
    @IsNonNullableOptional()
    @IsInt()
    @Min(0)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @ApiProperty({ minimum: 0 })
    watchesCount?: number;
}
