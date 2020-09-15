import { PaginationRequest } from '../PaginationRequest';
import { Role } from './Role';

/**
 * Interface for the classes representing user get request.
 *
 * @property {number} id                  - unique user' identifier.
 * @property {string} login               - user's login.
 * @property {string} name                - user's name.
 * @property {string} email               - user's email.
 * @property {Array<Role>} roles          - user's access rights. See {@link Role}
 * @property {string} [shikimoriId=null]  - user' id from Shikimori.
 * @property {Date} createdAt             - user' registration date.
 * @property {number} limit               - max values count to be found.
 * @property {number} offset              - offset from the beginning.
 */
export interface GetUsersRequest extends PaginationRequest {
  id?: number;
  login?: string;
  name?: string;
  email?: string;
  shikimoriId?: string | null;
  roles?: Role[];
  createdAt?: Date;
}
