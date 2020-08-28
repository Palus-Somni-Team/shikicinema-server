/**
 * Interface for the classes representing user get request.
 *
 * @property {number} limit     max values count to be found.
 * @property {number} offset    offset from the beginning.
 */
import {PaginationRequest} from '../PaginationRequest';
import {User} from './User';

export interface GetUsersRequest extends PaginationRequest, Partial<User> {}
