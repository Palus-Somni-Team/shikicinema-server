import { PaginationRequest } from '../../PaginationRequest';
import { VideoRequestTypeEnum } from './VideoRequestTypeEnum';

/**
 * Interface for the classes representing get videos request.
 *
 * @property {number} id Id of the request.
 * @property {VideoRequestTypeEnum[]} types Types of requests.
 * @property {number} userId Id of the user that created requests.
 */
export interface GetVideoRequestsRequest extends PaginationRequest {
    id?: number,
    types?: VideoRequestTypeEnum[],
    createdBy?: number,
    reviewedBy?: number,
}
