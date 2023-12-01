import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
    CreateVideoRequestRequest as Interface,
    VideoKindEnum,
    VideoQualityEnum,
    VideoRequestStatusEnum,
    VideoRequestTypeEnum,
} from '@shikicinema/types';
import { IsEnum, IsISO31661Alpha2, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateVideoRequestRequest implements Interface {
    @Expose()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ minimum: 0, required: true })
    videoId: number;

    @Expose()
    @IsEnum(VideoRequestTypeEnum)
    @ApiProperty({ required: true, enum: VideoRequestStatusEnum })
    type: VideoRequestTypeEnum;

    @Expose()
    @IsInt()
    @IsOptional()
    @Min(1)
    @Type(() => Number)
    @ApiProperty({ minimum: 1, required: false })
    episode?: number;

    @Expose()
    @IsEnum(VideoKindEnum)
    @IsOptional()
    @ApiProperty({ required: false, enum: VideoKindEnum })
    kind?: VideoKindEnum;

    @Expose()
    @IsEnum(VideoQualityEnum)
    @IsOptional()
    @ApiProperty({ required: false, enum: VideoQualityEnum })
    quality?: VideoQualityEnum;

    @Expose()
    @IsOptional()
    @IsISO31661Alpha2()
    @ApiProperty({ required: false })
    language?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @Length(1, 256)
    @ApiProperty({
        required: false,
        minLength: 1,
        maxLength: 256,
    })
    author?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @Length(1, 1000)
    @ApiProperty({
        required: false,
        minLength: 1,
        maxLength: 1000,
    })
    comment?: string;
}
