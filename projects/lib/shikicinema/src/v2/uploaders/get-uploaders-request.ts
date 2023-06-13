import { PaginationRequest } from '../PaginationRequest';

export interface GetUploadersRequest extends PaginationRequest {
    /**
     * Uploader's ID of User
     */
    userId?: number;

    /**
     * Uploader's ID on shikimori
     */
    shikimoriId?: string;
}
