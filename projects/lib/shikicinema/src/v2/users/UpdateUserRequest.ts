import { Role } from './Role';

/**
 * Interface for the classes representing user update request. ONLY FOR ADMINS!
 * Probably you should not use this
 *
 * @property {string} [name]        - see {@link User.name}.
 * @property {string} [email]       - see {@link User.email}.
 * @property {Array<Role>} [roles]  - see {@link User.roles}.
 */
export interface UpdateUserRequest {
    name?: string;
    email?: string;
    roles?: Role[];
}
