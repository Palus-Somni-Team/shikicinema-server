import { VideoRequest } from './VideoRequest';
import { GetVideoRequestsRequest } from './GetVideoRequestsRequest';
import { DataResponse } from '../../DataResponse';
import { GetByIdParamRequest } from '../../GetByIdParamRequest';

/**
 * Represents response for a {@link GetVideoRequestsRequest} request.
 */
export type GetVideoRequestsResponse = DataResponse<VideoRequest>;

/**
 * Represents request for a video request cancellation.
 */
export type CancelVideoRequestRequest = GetByIdParamRequest;

export * from './CreateVideoRequestRequest';
export * from './GetVideoRequestsRequest'
export * from './VideoRequestTypeEnum';
export * from './VideoRequestStatusEnum';
export * from './VideoRequest'
export * from './RejectVideoRequestRequest'
