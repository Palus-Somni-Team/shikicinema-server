import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class RequestsWithErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle()
            .pipe(catchError((error: Error) => {
                const httpCtx = context.switchToHttp();
                const { statusCode } = httpCtx.getResponse<Response>();

                if (
                    error instanceof HttpException &&
                    statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
                ) {
                    const { method, url } = httpCtx.getRequest<Request>();

                    Logger.error(error.message, error.stack, `${method} ${url}`);
                }

                throw error;
            }));
    }
}
