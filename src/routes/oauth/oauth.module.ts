import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { OAuthModule as OAuth, OAuthController } from 'nestjs-oauth2';

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
    controllers: [OAuthController],
})
export class OAuthModule {}
