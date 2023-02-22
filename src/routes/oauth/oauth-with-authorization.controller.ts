import { AuthenticatedGuard } from '@app-guards/authenticated.guard';
import { OAuthController } from 'nestjs-oauth2';
import { ShikimoriTransformInterceptor } from '@app-routes/oauth/interceptors/shikimori-transform.interceptor';
import { UseGuards, UseInterceptors } from '@nestjs/common';

@UseGuards(AuthenticatedGuard)
@UseInterceptors(ShikimoriTransformInterceptor)
export class OAuthWithAuthorizationController extends OAuthController {}
