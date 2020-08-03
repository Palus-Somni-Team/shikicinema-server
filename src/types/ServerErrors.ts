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
}
