import {Role} from './Role';

/**
 * @description Represents user
 * @property {number} id                - unique user' identifier.
 * @property {string} name              - user's name.
 * @property {string} login             - user's login.
 * @property {string} email             - user's email.
 * @property {string} password          - user's password. Use only for password change.
 * @property {number} [shikimoriId]     - user' id from Shikimori.
 * @property {Array.<Role>} roles       - access rights of user
 */
export interface User {
    id: number;
    name: string;
    login: string;
    email: string;
    password?: string;
    shikimoriId: number | null;
    createdAt: string;
    roles: Role[];
}
