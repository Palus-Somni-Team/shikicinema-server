/**
 * Interface for the classes representing get videos request.
 *
 * @property {number} animeId Id of an anime for requested videos.
 * @property {number} episode Number of an episode for requested videos.
 */
export interface GetVideosRequest {
    animeId: number;
    episode: number;
}
