import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetVideosInfoRequest {
    @Expose()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ minimum: 0 })
    animeId: number;
}
