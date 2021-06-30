import { VideoKind } from './VideoKind';
/**
 * Represents information about anime episode.
 *
 * @property {number} animeId Id of an anime.
 * @property {number} episode Number of an episode.
 * @property {string[]} availableDomains available domains that provides videos.
 * @property {string[]} availableKinds available kinds of videos.
 */
export interface AnimeEpisodeInfo {
    animeId: number;
    episode: number;
    availableDomains: Set<string>;
    availableKinds: Set<VideoKind>;
}
