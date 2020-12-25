import { AnimeEpisodeInfo as AnimeEpisode, VideoKindEnum } from '@lib-shikicinema';
import { Expose } from 'class-transformer';

export class AnimeEpisodeInfo implements AnimeEpisode {
    @Expose()
    animeId: number;

    @Expose()
    availableDomains: Set<string>;

    @Expose()
    availableKinds: Set<VideoKindEnum>;

    @Expose()
    episode: number;
}
