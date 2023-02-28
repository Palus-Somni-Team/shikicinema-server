import { ApiExcludeController } from '@nestjs/swagger';
import { AuthenticatedGuard } from '@app-guards/authenticated.guard';
import { BanStatusEnum } from '@app/types';
import { BanStatusGuard } from '@app-guards/ban-status.guard';
import { OAuthController } from 'nestjs-oauth2';
import { ShikimoriTransformInterceptor } from '@app-routes/oauth/interceptors/shikimori-transform.interceptor';
import { UseGuards, UseInterceptors } from '@nestjs/common';

@UseGuards(AuthenticatedGuard, BanStatusGuard(BanStatusEnum.DISALLOW_BANNED))
@UseInterceptors(ShikimoriTransformInterceptor)
@ApiExcludeController()
export class OAuthWithAuthorizationController extends OAuthController {}
