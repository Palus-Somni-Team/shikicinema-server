import {ServerError} from './ServerError';

export class ServerErrors {
    /**
     * @description Unauthorized - 401 - Could not be processed due to unauthorized request
     */
    static readonly UNAUTHORIZED = new ServerError(
        'Unauthorized',
        401,
        'Could not be processed due to unauthorized request',
    );

    /**
     * @description Unauthorized - 401 - Token is invalid or expired or granted to another client
     */
    static readonly INVALID_TOKEN = new ServerError(
        'Unauthorized',
        401,
        'Token is invalid or expired or granted to another client',
    );

    static readonly USER_EXISTS = new ServerError(
        'Conflict',
        409,
        'User with same login or email already exist',
    );

    static readonly FORBIDDEN = new ServerError(
        'Forbidden',
        403,
        'Trying to change protected resources you don\'t have access to',
    );
}
