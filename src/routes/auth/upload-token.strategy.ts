import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UploadTokenEntity } from '@app-entities';
import { UploadTokensService } from '../../services/upload-tokens/upload-tokens.service';

@Injectable()
export class UploadTokenStrategy extends PassportStrategy(BearerStrategy) {
    constructor(
        private readonly uploadTokensService: UploadTokensService
    ) {
        super();
    }

    async validate(bearer: string): Promise<number> {
        let token: UploadTokenEntity;

        try {
            token = await this.uploadTokensService.getByToken(bearer);
        } catch (e) {
            throw new UnauthorizedException('Token is expired or invalid');
        }

        if (!token || token.isExpired || token.revoked) {
            throw new UnauthorizedException('Token is expired or invalid');
        }

        if (token.uploader.banned) {
            throw new ForbiddenException('You have been banned');
        }

        return token.uploader.id;
    }
}
