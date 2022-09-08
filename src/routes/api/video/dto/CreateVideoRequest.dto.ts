import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsISO31661Alpha2, IsInt, IsString, IsUrl, Length, Min } from 'class-validator';
import { CreateVideoRequest as Request, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';

export class CreateVideoRequest implements Request {
    @Expose()
    @IsString()
    @Length(5, 2048)
    @IsUrl()
    @ApiProperty({
        minLength: 5,
        maxLength: 2048,
    })
    url: string;

    @Expose()
    @IsInt()
    @Min(0)
    @ApiProperty({ minimum: 0 })
    animeId: number;

    @Expose()
    @IsInt()
    @Min(1)
    @ApiProperty({ minimum: 1 })
    episode: number;

    @Expose()
    @IsEnum(VideoKindEnum)
    @ApiProperty({ enum: VideoKindEnum })
    kind: VideoKindEnum;

    @Expose()
    @IsISO31661Alpha2()
    @ApiProperty()
    language: string;

    @Expose()
    @IsEnum(VideoQualityEnum)
    @ApiProperty({ enum: VideoQualityEnum })
    quality: VideoQualityEnum;

    @Expose()
    @IsString()
    @Length(1, 256)
    @ApiProperty({
        minLength: 1,
        maxLength: 256,
    })
    author: string;
}
