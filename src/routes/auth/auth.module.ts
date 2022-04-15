import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalGuard } from '@app/guards/local.guard';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { SessionSharedModule } from '@app-services/session/session.shared.module';
import { ShikimoriSharedModule } from '@app-services/shikimori/shikimori.shared.module';
import { UploadTokenGuard } from '@app/guards/upload-token.guard';
import { UploadTokenStrategy } from './upload-token.strategy';
import { UploadTokensSharedModule } from '@app-services/upload-tokens/upload-tokens.shared.module';
import { UploaderSharedModule } from '@app-services/uploader/uploader.shared.module';
import { UserSharedModule } from '@app-services/user/user.shared.module';

@Module({
    imports: [
        UserSharedModule,
        UploadTokensSharedModule,
        UploaderSharedModule,
        SessionSharedModule,
        ShikimoriSharedModule,
        PassportModule.register({
            defaultStrategy: 'local',
            session: true,
        }),
    ],
    providers: [
        AuthService,
        SessionSerializer,
        LocalStrategy,
        LocalGuard,
        UploadTokenGuard,
        UploadTokenStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
