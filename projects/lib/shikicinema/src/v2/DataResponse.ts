/**
 * Represents response with list of data.
 */
export interface DataResponse<T> {
    data: T[];
    limit: number;
    offset: number;
    total: number;
}
