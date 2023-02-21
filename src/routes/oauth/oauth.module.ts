import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { OAuthModule as OAuth } from 'nestjs-oauth2';
import { OAuthWithAuthorizationController } from '@app-routes/oauth/oauth-with-authorization.controller';

@Module({
    imports: [
        OAuth.forFeatureAsync({
            useFactory: (config: ConfigService) => ({
                providers: [
                    config.get('shikimori-oauth'),
                ],
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [OAuthWithAuthorizationController],
})
export class OAuthModule {}
