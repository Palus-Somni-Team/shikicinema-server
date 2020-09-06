import {Role} from './Role';

/**
 * Interface for the classes representing user create request. ONLY FOR ADMINS!
 * Probably you should not use this
 *
 * @property {string} login     - see {@link AdminUser.login}.
 * @property {string} email     - see {@link AdminUser.email}.
 * @property {string} password  - password which will be hashed and stored.
 * @property {string} [roles]   - see {@link AdminUser.roles}.
 */
export interface CreateUserRequest {
  login: string;
  email: string;
  password: string;
  roles?: Role[];
}
