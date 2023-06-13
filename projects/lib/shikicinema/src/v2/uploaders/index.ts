import { DataResponse } from '../DataResponse';
import { Uploader } from './uploader';

export * from './uploader';
export * from './get-uploaders-request';

/**
 * Represents response for {@link GetUploadersResponse} request.
 */
export type GetUploadersResponse = DataResponse<Uploader>;
