import {Role} from './Role';

/**
 * Interface for the classes representing user update request.
 *
 * @property {number} id            see {@link User.id}.
 * @property {string} name          see {@link User.name}.
 * @property {string} login         see {@link User.login}.
 * @property {string} email         see {@link User.email}.
 * @property {number} [shikimoriId] see {@link User.shikimoriId}.
 * @property {string} roles         see {@link User.roles}.
 */
export interface UpdateUserRequest {
    name?: string;
    password?: string;
    login?: string;
    email?: string;
    shikimoriId?: number | null;
    roles?: Role[];
}
