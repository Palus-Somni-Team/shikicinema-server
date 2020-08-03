import {AuthConfig} from '../src/types/AuthConfig';

const isProduction = process.env.NODE_ENV === 'production';
export default {
    isProduction: isProduction,
    accessTokenLife: 60 * 60 * 1000, // 1h
    cookieLife: 24 * 60 * 60 * 1000, // 1d
    refreshTokenLife: 24 * 60 * 60 * 1000, // 1d
    sessionSecret: isProduction ? `${process.env.SESSION_SECRET}` : 'secret',
    cookieSecret: isProduction ? `${process.env.COOKIE_SECRET}` : 'cookie_secret',
} as AuthConfig;
