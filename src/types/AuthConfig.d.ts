export type AuthConfig = {
    readonly isProduction: boolean;
    readonly accessTokenLife: number;
    readonly cookieLife: number;
    readonly refreshTokenLife: number;
    readonly sessionSecret: string;
    readonly cookieSecret: string;
}
