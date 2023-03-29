import { AnimeEpisodeInfo as AnimeEpisode, VideoKindEnum } from '@shikicinema/types';

export class AnimeEpisodeInfo implements AnimeEpisode {
    episode: number;
    domains: Array<string>;
    kinds: Array<VideoKindEnum>;

    constructor(episode: number, domains: Array<string>, kinds: Array<VideoKindEnum>) {
        this.episode = episode;
        this.domains = domains;
        this.kinds = kinds;
    }
}
