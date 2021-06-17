import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { UploaderEntity } from '@app-entities';
import { UserService } from '../user/user.service';
import { isPgException, PgException } from '@app-utils/postgres.utils';

@Injectable()
export class UploaderService {
  constructor(
    @InjectRepository(UploaderEntity)
    private readonly repository: Repository<UploaderEntity>,
    private readonly userService: UserService,
  ) {}

  async newShikimoriUploader(shikimoriId: string, userId: number = null): Promise<UploaderEntity> {
    try {
      const user = await this.userService.findById({ id: userId });
      let uploader = new UploaderEntity(shikimoriId, user, []);

      await getConnection().transaction(async (manager) => {
        uploader = await manager.save(uploader);
        user.uploader = uploader;
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
    return this.repository.findOne(uploaderId);
  }

  getByUserId(userId: number): Promise<UploaderEntity> {
    return this.repository.findOne({ where: { userId } })
  }

  getByShikimoriId(shikimoriId: string): Promise<UploaderEntity> {
    if (!shikimoriId) {
      throw new BadRequestException('shikimoriId cannot be empty');
    }

    return this.repository.findOne({ where: { shikimoriId } })
  }

  setBannedStatus(banned: boolean, uploader: UploaderEntity): Promise<UploaderEntity> {
    uploader.banned = banned;
    return this.repository.save(uploader);
  }
}
