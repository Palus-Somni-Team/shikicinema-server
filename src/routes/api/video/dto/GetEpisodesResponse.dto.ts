import { AnimeEpisodeInfo } from '@app-routes/api/video/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GetEpisodesResponse as Response } from '@lib-shikicinema';

export class GetEpisodesResponse implements Response {
    @Expose()
    @ApiProperty()
    data: AnimeEpisodeInfo[];

    @Expose()
    @ApiProperty()
    limit: number;

    @Expose()
    @ApiProperty()
    offset: number;

    @Expose()
    @ApiProperty()
    total: number;

    constructor(data: AnimeEpisodeInfo[], limit: number, offset: number, total: number) {
        this.data = data;
        this.limit = limit;
        this.offset = offset;
        this.total = total;
    }
}
