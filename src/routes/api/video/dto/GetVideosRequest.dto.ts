import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { GetVideosRequest as Request } from '@lib-shikicinema';

export class GetVideosRequest implements Request {
    @Expose()
    @IsInt()
    @Type(() => Number)
    animeId: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    episode?: number;
}
