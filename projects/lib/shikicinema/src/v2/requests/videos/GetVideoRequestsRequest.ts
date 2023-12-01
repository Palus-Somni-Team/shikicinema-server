import { PaginationRequest } from '../../PaginationRequest';
import { VideoRequestTypeEnum } from './VideoRequestTypeEnum';

/**
 * Interface for the classes representing get video requests.
 *
 * @property {number} id Id of the request.
 * @property {VideoRequestTypeEnum[]} types Types of requests.
 * @property {number} createdBy Id of the uploader that created request.
 * @property {number} reviewedBy Id of the user that reviewed request.
 */
export interface GetVideoRequestsRequest extends PaginationRequest {
    id?: number,
    types?: VideoRequestTypeEnum[],
    createdBy?: number,
    reviewedBy?: number,
}
