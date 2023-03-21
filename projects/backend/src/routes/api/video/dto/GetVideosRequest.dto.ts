import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { GetVideosRequest as Request } from '@shikicinema/types';

export class GetVideosRequest implements Request {
    @Expose()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ minimum: 0 })
    animeId: number;

    @Expose()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    @ApiProperty({ minimum: 1 })
    episode: number;

    @Expose()
    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    @ApiProperty({
        minimum: 1,
        maximum: 100,
        required: false,
        default: 20,
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
