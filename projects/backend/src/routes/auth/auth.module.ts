import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '~backend/routes/auth/auth.controller';
import { AuthService } from '~backend/routes/auth/auth.service';
import { LocalGuard } from '~backend/guards/local.guard';
import { LocalStrategy } from '~backend/routes/auth/local.strategy';
import { SessionSerializer } from '~backend/routes/auth/session.serializer';
import { SessionSharedModule } from '~backend/services/session/session.shared.module';
import { ShikimoriSharedModule } from '~backend/services/shikimori/shikimori.shared.module';
import { UploadTokenGuard } from '~backend/guards/upload-token.guard';
import { UploadTokenStrategy } from '~backend/routes/auth/upload-token.strategy';
import { UploadTokensSharedModule } from '~backend/services/upload-tokens/upload-tokens.shared.module';
import { UploaderSharedModule } from '~backend/services/uploader/uploader.shared.module';
import { UserSharedModule } from '~backend/services/user/user.shared.module';

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
