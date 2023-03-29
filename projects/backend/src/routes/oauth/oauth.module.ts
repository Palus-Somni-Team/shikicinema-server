import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { OAuthModule as OAuth } from 'nestjs-oauth2';
import { OAuthWithAuthorizationController } from '~backend/routes/oauth/oauth-with-authorization.controller';
import { UserSharedModule } from '~backend/services/user/user.shared.module';

@Module({
    imports: [
        UserSharedModule,
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
