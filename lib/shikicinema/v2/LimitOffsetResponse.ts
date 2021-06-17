import { DataResponse } from './DataResponse';

/**
 * Represents response for the request with limit and offset props.
 */
export interface LimitOffsetResponse<T> extends DataResponse<T> {
    limit: number;
    offset: number;
}
