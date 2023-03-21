import * as bcrypt from 'bcrypt';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Role } from '@shikicinema/types';

import { IRequest, RegisterUser, ShikimoriAccessToken } from '~backend/routes/auth/dto';
import { SessionService } from '~backend/services/session/session.service';
import { ShikimoriClient } from '~backend/services/shikimori/shikimori.client';
import { ShikimoriUser } from '~backend/services/shikimori/dto/ShikimoriUser.dto';
import {
    UploadTokenEntity,
    UploaderEntity,
    UserEntity,
} from '~backend/entities';
import { UploadTokensService } from '~backend/services/upload-tokens/upload-tokens.service';
import { UploaderService } from '~backend/services/uploader/uploader.service';
import { UserService } from '~backend/services/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
        private readonly shikimoriService: ShikimoriClient,
        private readonly uploaderService: UploaderService,
        private readonly uploadTokensService: UploadTokensService,
    ) {}

    async getUserWithCredentials(login: string, password: string): Promise<UserEntity> {
        try {
            const user = await this.userService.findByLogin(login);
            const passed = await bcrypt.compare(password, `${user?.password}`);

            return passed ? user : null;
        } catch (e) {
            return null;
        }
    }

    getLoggedInUser(req: IRequest): Promise<UserEntity> {
        return this.userService.findById(req.user);
    }

    async createUploadToken(shikimoriToken: ShikimoriAccessToken): Promise<UploadTokenEntity> {
        let shikimoriUser: ShikimoriUser;
        let uploader: UploaderEntity;

        try {
            shikimoriUser = await this.shikimoriService.getUserInfoByToken(shikimoriToken.token);
        } catch (e) {
            throw new BadRequestException('Your shikimori access token is expired');
        }

        try {
            uploader = await this.uploaderService.getByShikimoriId(shikimoriUser?.id);
        } catch (e) {
            throw new NotFoundException('You must register first');
        }

        return this.uploadTokensService.generateToken(uploader);
    }

    async logout(req: IRequest): Promise<void> {
        try {
            const sid = req.sessionID;
            await this.sessionService.revokeById(sid);
            req.logout(() => ({}));
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async newUploader(req: IRequest, shikimoriToken: ShikimoriAccessToken): Promise<UploaderEntity> {
        let shikimoriUser: ShikimoriUser;

        try {
            shikimoriUser = await this.shikimoriService.getUserInfoByToken(shikimoriToken.token);
        } catch (e) {
            throw new BadRequestException('Your shikimori access token is expired');
        }

        return this.uploaderService.newShikimoriUploader(shikimoriUser.id, req.user ? req.user : null);
    }

    register(user: RegisterUser): Promise<UserEntity> {
        return this.userService.create({
            login: user.login,
            password: user.password,
            email: user.email,
            roles: [Role.user],
        });
    }
}
