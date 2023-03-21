/**
 * @description Represents user
 *
 * @property {number} id                  - unique user' identifier.
 * @property {string} login               - user's login.
 * @property {string} name                - user's name.
 * @property {string} [shikimoriId=null]  - user' id from Shikimori.
 */
export interface User {
    id: number;
    login: string;
    name: string;
    shikimoriId: string | null;
}
