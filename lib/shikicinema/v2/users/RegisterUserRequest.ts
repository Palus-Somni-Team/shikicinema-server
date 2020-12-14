/**
 * Interface for the classes representing user register request. ONLY FOR ADMINS!
 * Probably you should not use this
 *
 * @property {string} login     - see {@link AdminUser.login}.
 * @property {string} email     - see {@link AdminUser.email}.
 * @property {string} password  - password which will be hashed and stored.
 */
export interface RegisterUserRequest {
  login: string;
  email: string;
  password: string;
}
