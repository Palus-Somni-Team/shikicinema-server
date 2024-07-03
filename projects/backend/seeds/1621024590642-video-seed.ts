import { MigrationInterface, QueryRunner } from 'typeorm';
import { VideoKindEnum, VideoQualityEnum } from '@shikicinema/types';

import { AuthorEntity, UploaderEntity, VideoEntity } from '~backend/entities';

const seeds: VideoEntity[] = [];

export class VideoSeed1621024590642 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const uploaderRepo = await queryRunner.manager.getRepository(UploaderEntity);
        const user = await uploaderRepo.findOneBy({ shikimoriId: '278015' });
        const admin = await uploaderRepo.findOneBy({ shikimoriId: '13371337' });
        const banned = await uploaderRepo.findOneBy({ shikimoriId: '99999999' });

        const authorsRepo = await queryRunner.manager.getRepository(AuthorEntity);
        const authors = await authorsRepo.find();
        let i = 0;

        seeds.push(
            new VideoEntity(21, 113, 'https://kek.lol', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, authors[i++ % authors.length], user),
            new VideoEntity(1, 1, 'https://admin1.up', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, authors[i++ % authors.length], admin),
            new VideoEntity(1, 2, 'https://admin2.up', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, authors[i++ % authors.length], admin),
            new VideoEntity(1, 3, 'https://admin3.up', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, authors[i++ % authors.length], admin),
            new VideoEntity(1337, 7, 'https://banned.com', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, authors[i++ % authors.length], banned),
            new VideoEntity(404, 404, 'https://marked_as_deleted.com', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, authors[i++ % authors.length], user),
        );

        const videoRepo = await queryRunner.manager.getRepository(VideoEntity);
        const entities = await videoRepo.save(seeds);

        const toMarkAsDeleted = entities.find((v) => v.animeId === 404 && v.episode === 404);
        await videoRepo.softDelete(toMarkAsDeleted.id);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const videoRepo = await queryRunner.manager.getRepository(VideoEntity);
        await videoRepo.clear();
    }
}
