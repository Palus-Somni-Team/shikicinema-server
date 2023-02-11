import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PgException, isPgException } from '@app-utils/postgres.utils';
import { UploaderEntity } from '@app-entities';
import { UserService } from '@app-services/user/user.service';

@Injectable()
export class UploaderService {
    constructor(
        @InjectRepository(UploaderEntity)
        private readonly repository: Repository<UploaderEntity>,
        private readonly userService: UserService,
        private readonly dataSource: DataSource,
    ) {}

    async newShikimoriUploader(shikimoriId: string, userId: number = null): Promise<UploaderEntity> {
        try {
            const user = await this.userService.findById(userId);
            const uploader = new UploaderEntity(shikimoriId, user, []);

            await this.dataSource.transaction(async (manager) => {
                user.uploader = await manager.save(uploader);
                await manager.save(user);
            });

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
