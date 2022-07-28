import { VideoKindEnum } from '@lib-shikicinema';

export interface RawAnimeEpisodeInfoInterface {
    episode: number;
    url: string;
    kind: VideoKindEnum;
}
