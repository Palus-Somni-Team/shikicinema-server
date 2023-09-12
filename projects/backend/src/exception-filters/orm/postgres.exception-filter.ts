import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

import { PgException } from '~backend/utils/postgres.utils';

@Catch(QueryFailedError)
export class PostgresExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception.message;

        switch (exception.driverError.code) {
            case PgException.UNIQUE_CONSTRAINS_ERROR:
                statusCode = HttpStatus.CONFLICT;
                message = 'Duplicated entities';
                break;
            default:
                break;
        }

        response
            .status(statusCode)
            .json({
                statusCode,
                message,
            });
    }
}
