import {Role} from './Role';

/**
 * Interface for the classes representing user create request.
 *
 * @property {string} login     see {@link User.login}.
 * @property {string} email     see {@link User.email}.
 * @property {string} password  password which will be hashed and stored.
 * @property {string} roles     see {@link User.roles}.
 */
export interface CreateUserRequest {
    login: string;
    email: string;
    password: string;
    roles?: Role[];
}
