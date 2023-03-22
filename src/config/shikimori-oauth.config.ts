import { OAuthProvider } from 'nestjs-oauth2/dist/oauth/oauth.interfaces';
import { registerAs } from '@nestjs/config';

export default registerAs('shikimori-oauth', () => ({
    name: 'shikimori',
    accessTokenUrl: 'https://shikimori.one/oauth/token',
    authorizeUrl: 'https://shikimori.one/oauth/authorize',
    redirectOrigin: process.env.SHIKIMORI_OUATH_ORIGIN,
    scope: 'user_rates comments topics',
    clientId: process.env.SHIKIMORI_OUATH_CLIENT_ID,
    clientSecret: process.env.SHIKIMORI_OUATH_CLIENT_SECRET,
}) as OAuthProvider);
