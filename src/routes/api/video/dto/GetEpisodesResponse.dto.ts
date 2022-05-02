import { Expose } from 'class-transformer';
import { GetEpisodesResponse as Response } from '@lib-shikicinema';

import { AnimeEpisodeInfo } from '@app-routes/api/video/dto/AnimeEpisodeInfo.dto';

export class GetEpisodesResponse implements Response {
    @Expose()
    data: AnimeEpisodeInfo[];

    @Expose()
    limit: number;

    @Expose()
    offset: number;

    @Expose()
    nextCursor: number;
}
