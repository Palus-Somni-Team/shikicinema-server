import { Role } from './Role';

/**
 * @description Represents user ONLY FOR ADMINS!
 * Probably you should not use this
 *
 * @property {number} id                  - unique user' identifier.
 * @property {string} login               - user's login.
 * @property {string} name                - user's name.
 * @property {string} email               - user's email.
 * @property {Array<Role>} roles          - user's access rights. See {@link Role}
 * @property {string} [shikimoriId=null]  - user' id from Shikimori.
 * @property {Date} createdAt             - user' registration date.
 * @property {Date} updatedAt             - user' last change date.
 */
export interface AdminUser {
    id: number;
    login: string;
    name: string;
    email: string;
    roles: Role[];
    shikimoriId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
