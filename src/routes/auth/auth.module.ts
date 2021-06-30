import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalGuard } from '../../guards/local.guard';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { SessionSharedModule } from '../../services/session/session.shared.module';
import { ShikimoriSharedModule } from '../../services/shikimori/shikimori.shared.module';
import { UploadTokenGuard } from '../../guards/upload-token.guard';
import { UploadTokenStrategy } from './upload-token.strategy';
import { UploadTokensSharedModule } from '../../services/upload-tokens/upload-tokens.shared.module';
import { UploaderSharedModule } from '../../services/uploader/uploader.shared.module';
import { UserSharedModule } from '../../services/user/user.shared.module';

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
