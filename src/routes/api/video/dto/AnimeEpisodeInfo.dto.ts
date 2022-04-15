import { AnimeEpisodeInfo as AnimeEpisode, VideoKindEnum } from '@lib-shikicinema';

export class AnimeEpisodeInfo implements AnimeEpisode {
    [episode: number]: {
        domains: Array<string>;
        kinds: Array<VideoKindEnum>
    };
}
