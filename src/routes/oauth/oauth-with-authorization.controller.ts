import { OAuthController } from 'nestjs-oauth2';
import { ShikimoriTransformInterceptor } from '@app-routes/oauth/interceptors/shikimori-transform.interceptor';
import { UseInterceptors } from '@nestjs/common';

@UseInterceptors(ShikimoriTransformInterceptor)
export class OAuthWithAuthorizationController extends OAuthController {}
