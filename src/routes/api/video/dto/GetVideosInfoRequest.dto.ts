import { Expose, Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetVideosInfoRequest {
    @Expose()
    @IsInt()
    @Type(() => Number)
    animeId: number;
}
