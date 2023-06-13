import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Uploader } from '@shikicinema/types';

import { DevAssert } from '~backend/utils/checks/dev/dev-assert';
import { IRequest } from '~backend/routes/auth/dto/IRequest.dto';
import { PgException, isPgException, toSqlWhere } from '~backend/utils/postgres.utils';
import { SORT_BY_ID_ASC } from '~backend/constants';
import { ShikimoriAccessToken } from '~backend/routes/auth/dto/ShikimoriAccessToken.dto';
import { ShikimoriClient } from '~backend/services/shikimori/shikimori.client';
import { ShikimoriUser } from '~backend/services/shikimori/dto/ShikimoriUser.dto';
import { UploaderEntity } from '~backend/entities';
import { UserAssert } from '~backend/utils/checks/user/user-assert';
import { UserEntity } from '~backend/entities/user';
import { isEntity } from '~backend/utils/is-entity.utils';

@Injectable()
export class UploaderService {
    constructor(
        @InjectRepository(UploaderEntity)
        private readonly repository: Repository<UploaderEntity>,
        private readonly dataSource: DataSource,
        private readonly shikimoriService: ShikimoriClient,
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

    getByShikimoriId(shikimoriId: string): Promise<UploaderEntity> {
        if (!shikimoriId) {
            throw new BadRequestException('shikimoriId cannot be empty');
        }

        return this.repository.findOne({ where: { shikimoriId } });
    }

    findAll(
        userId: number,
        shikimoriId: string,
        banned: boolean,
        offset: number,
        limit: number
    ): Promise<[UploaderEntity[], number]> {
        DevAssert.check('limit', limit)
            .notNullish()
            .greaterOrEqualTo(1)
            .lessOrEqualTo(100);

        DevAssert.check('offset', offset)
            .notNullish()
            .greaterOrEqualTo(0);

        const where = toSqlWhere({ shikimoriId, banned });

        if (userId) {
            where['user.id'] = userId;
        }

        return this.repository.findAndCount({
            where,
            skip: offset,
            take: limit,
            order: SORT_BY_ID_ASC,
            relations: ['user'],
        });
    }

    editUploader(id: number, uploader: Partial<Uploader>) {
        DevAssert.check('id', id)
            .notNullish()
            .greaterOrEqualTo(0);

        DevAssert.check('uploader', uploader)
            .notNullish();

        return this.dataSource.transaction(async (entityManager) => {
            const uploadersRepo = entityManager.getRepository(UploaderEntity);

            const entity = await uploadersRepo.findOne({
                where: { id },
                relations: ['user'],
            });

            UserAssert.check('uploader', entity)
                .exists();

            if (uploader.userId) {
                const usersRepo = entityManager.getRepository(UserEntity);
                const targetUser = await usersRepo.findOne({
                    where: { id: uploader.userId },
                    relations: ['uploader'],
                });

                UserAssert.check('userId', targetUser)
                    .exists();
                UserAssert.check('target user', targetUser?.uploader)
                    .notExists();

                entity.user = targetUser;
            }

            if (uploader.userId === null) {
                entity.user = null;
            }

            entity.banned = uploader?.banned ?? entity.banned;
            entity.shikimoriId = uploader?.shikimoriId ?? entity.shikimoriId;

            await uploadersRepo.save(entity);

            return entity;
        });
    }

    async newUploader(req: IRequest, shikimoriToken: ShikimoriAccessToken): Promise<UploaderEntity> {
        let shikimoriUser: ShikimoriUser;

        try {
            shikimoriUser = await this.shikimoriService.getUserInfoByToken(shikimoriToken.token);
        } catch (e) {
            throw new BadRequestException('Your shikimori access token is expired');
        }

        return this.newShikimoriUploader(shikimoriUser.id, req.user ? req.user : null);
    }
}
