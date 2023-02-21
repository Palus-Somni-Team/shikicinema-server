import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/* expires_in and created_at represented in seconds */
interface ShikimoriOAuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
    access_token: string;
    token_type: string;
    expires_in: number;
    created_at: number;
}

@Injectable()
export class ShikimoriTransformInterceptor<T> implements NestInterceptor<T, ShikimoriOAuthResponse> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ShikimoriOAuthResponse> {
        const { provider } = context.switchToHttp().getRequest().params;
        const isShikimoriRoute = provider === 'shikimori';

        return isShikimoriRoute
            ? next.handle()
                .pipe(
                    map(({ accessToken, refreshToken, expires_in, created_at, scope }: ShikimoriOAuthResponse) => ({
                        accessToken, refreshToken, scope,
                        expires: new Date((expires_in + created_at) * 1000),
                    }))
                )
            : next.handle();
    }
}
