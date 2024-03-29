import { VideoKindEnum } from './VideoKindEnum';

/**
 * Represents information about anime episode.
 *
 * @property {number} episode Number of an episode.
 * @property {string[]} availableDomains available domains that provides videos.
 * @property {string[]} availableKinds available kinds of videos.
 */
export interface AnimeEpisodeInfo {
    episode: number;
    domains: Array<string>;
    kinds: Array<VideoKindEnum>;
}
