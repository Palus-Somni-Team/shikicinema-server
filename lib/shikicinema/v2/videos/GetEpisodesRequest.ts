import { PaginationRequest } from '../PaginationRequest';

/**
 * Interface for the classes representing get list of episodes request.
 *
 * @property {number} animeId Id of an anime for requested videos.
 */
export interface GetEpisodesRequest extends PaginationRequest {
    animeId: number;
}
