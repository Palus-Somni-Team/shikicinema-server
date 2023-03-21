import { AnimeEpisodeInfo } from '~backend/routes/api/video/dto/index';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetEpisodesResponse as Response } from '@shikicinema/types';

export class GetEpisodesResponse implements Response {
    @Expose()
    @ApiProperty()
    @Type(() => AnimeEpisodeInfo)
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

    constructor(data?: AnimeEpisodeInfo[], limit?: number, offset?: number, total?: number) {
        this.data = data;
        this.limit = limit;
        this.offset = offset;
        this.total = total;
    }
}
