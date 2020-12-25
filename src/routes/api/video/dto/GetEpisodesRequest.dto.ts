import { Expose } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { GetEpisodesRequest as Request } from '@lib-shikicinema';

export class GetEpisodesRequest implements Request {
    @Expose()
    @IsInt()
    animeId: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    cursor?: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(1000)
    limit?: number;
}
