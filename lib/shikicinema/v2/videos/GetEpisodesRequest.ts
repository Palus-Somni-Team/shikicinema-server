/**
 * Interface for the classes representing get list of episodes request.
 *
 * @property {number} animeId Id of an anime for requested videos.
 * @property {number} episode Number of an episode for requested videos.
 */
export interface GetEpisodesRequest {
    animeId: number;
    cursor?: number;
    limit?: number;
}
