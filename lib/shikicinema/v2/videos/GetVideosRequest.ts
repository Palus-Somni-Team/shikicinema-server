/**
 * Interface for the classes representing get videos request.
 *
 * @property {number} animeId Id of an anime for requested videos.
 * @property {number} episode <p>Number of an episode for requested videos.</p>
 *                            <p><i>May be empty if you do not want select specific episode</i></p>
 */
export interface GetVideosRequest {
    animeId: number;
    episode: number;
}
