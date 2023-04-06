import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PgException, isPgException } from '~backend/utils/postgres.utils';
import { UploaderEntity } from '~backend/entities';
import { UserEntity } from '~backend/entities/user';
import { isEntity } from '~backend/utils/is-entity.utils';

@Injectable()
export class UploaderService {
    constructor(
        @InjectRepository(UploaderEntity)
        private readonly repository: Repository<UploaderEntity>,
        private readonly dataSource: DataSource,
    ) {}

    async newShikimoriUploader(
        shikimoriId: string,
        userEntityOrId: UserEntity | number = null,
        manager = this.dataSource.manager
    ): Promise<UploaderEntity> {
        try {
            const userService = manager.getRepository(UserEntity);
            const user: UserEntity = isEntity(userEntityOrId, UserEntity)
                ? userEntityOrId
                : await userService.findOneBy({ id: userEntityOrId });
            const uploader = new UploaderEntity(shikimoriId, user, []);

            if (user) {
                await manager.transaction(async (manager) => {
                    user.uploader = await manager.save(uploader);
                    await manager.save(user);
                });
            } else {
                await manager.save(uploader);
            }

            return uploader;
        } catch (e) {
            if (isPgException(e, PgException.UNIQUE_CONSTRAINS_ERROR)) {
                throw new ConflictException();
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    getByUploaderId(uploaderId: number): Promise<UploaderEntity> {
        return this.repository.findOneBy({ id: uploaderId });
    }

    getByUserId(userId: number): Promise<UploaderEntity> {
        return this.repository.findOneBy({ user: { id: userId } });
    }

    getByShikimoriId(shikimoriId: string): Promise<UploaderEntity> {
        if (!shikimoriId) {
            throw new BadRequestException('shikimoriId cannot be empty');
        }

        return this.repository.findOne({ where: { shikimoriId } });
    }

    setBannedStatus(banned: boolean, uploader: UploaderEntity): Promise<UploaderEntity> {
        uploader.banned = banned;
        return this.repository.save(uploader);
    }
}
