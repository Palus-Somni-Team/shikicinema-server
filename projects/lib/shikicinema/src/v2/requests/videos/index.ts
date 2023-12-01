import { VideoRequest } from './VideoRequest';
import { GetVideoRequestsRequest } from './GetVideoRequestsRequest';
import { DataResponse } from '../../DataResponse';

/**
 * Represents response for a {@link GetVideoRequestsRequest} request.
 */
export type GetVideoRequestsResponse = DataResponse<VideoRequest>;

export * from './CreateVideoRequestRequest';
export * from './GetVideoRequestsRequest'
export * from './VideoRequestTypeEnum';
export * from './VideoRequestStatusEnum';
export * from './VideoRequest'
