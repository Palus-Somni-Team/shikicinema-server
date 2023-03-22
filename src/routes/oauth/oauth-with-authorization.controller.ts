import { ApiExcludeController } from '@nestjs/swagger';
import { AuthenticatedGuard } from '@app-guards/authenticated.guard';
import { NoBannedUsersGuard } from '@app-guards/no-banned-users-guard.service';
import { OAuthController } from 'nestjs-oauth2';
import { ShikimoriTransformInterceptor } from '@app-routes/oauth/interceptors/shikimori-transform.interceptor';
import { UseGuards, UseInterceptors } from '@nestjs/common';

@UseGuards(AuthenticatedGuard, NoBannedUsersGuard)
@UseInterceptors(ShikimoriTransformInterceptor)
@ApiExcludeController()
export class OAuthWithAuthorizationController extends OAuthController {}
