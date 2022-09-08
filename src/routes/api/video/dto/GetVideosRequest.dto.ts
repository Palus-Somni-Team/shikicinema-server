import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { GetVideosRequest as Request } from '@lib-shikicinema';

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
}
