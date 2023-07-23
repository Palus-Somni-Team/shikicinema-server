import { DataResponse } from '../DataResponse';
import { Author } from './Author';

export * from './Author';
export * from './GetAuthorsRequest';

/**
 * Represents response for {@link GetAuthorsRequest} request.
 */
export type GetAuthorResponse = DataResponse<Author>;
