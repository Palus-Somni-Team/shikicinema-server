import { PaginationRequest } from '../PaginationRequest';

export interface GetAuthorsRequest extends PaginationRequest {
    /**
     * Author's name or part of it
     */
    name?: string;
}
