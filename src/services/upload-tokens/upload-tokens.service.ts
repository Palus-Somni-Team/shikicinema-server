import { v4 as uuid4 } from 'uuid';
import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploaderEntity, UploadTokenEntity } from '@app-entities';
import { isPgException, PgException } from '@app-utils/postgres.utils';

@Injectable()
export class UploadTokensService {
    constructor(
        @InjectRepository(UploadTokenEntity)
        private readonly repository: Repository<UploadTokenEntity>,
    ) {}

    getByToken(token: string): Promise<UploadTokenEntity> {
        return this.repository.findOne({
            where: { token },
            relations: ['uploader'],
        });
    }

    async generateToken(uploader: UploaderEntity): Promise<UploadTokenEntity> {
        if (uploader?.banned) {
            throw new ForbiddenException('You have been banned');
        }

        try {
            return await this.repository.save(new UploadTokenEntity(await uuid4(), uploader));
        } catch (e) {
            if (isPgException(e, PgException.UNIQUE_CONSTRAINS_ERROR)) {
                throw new ConflictException();
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async revoke(token: UploadTokenEntity): Promise<UploadTokenEntity> {
        token.revoked = true;
        return this.repository.save(token);
    }

    async revokeAllFromUploader(uploader: UploaderEntity): Promise<void> {
        await this.repository.delete({ uploader });
    }
}
