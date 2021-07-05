import { MigrationInterface, getRepository } from 'typeorm';
import { VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';

import { UploaderEntity, VideoEntity } from '@app-entities';

const seeds: VideoEntity[] = [];

export class VideoSeed1621024590642 implements MigrationInterface {
    public async up(): Promise<void> {
        const uploaderRepo = await getRepository(UploaderEntity);
        const user = await uploaderRepo.findOne({ shikimoriId: '278015' });
        const admin = await uploaderRepo.findOne({ shikimoriId: '13371337' });
        const banned = await uploaderRepo.findOne({ shikimoriId: '99999999' });

        seeds.push(
            new VideoEntity(21, 113, 'https://kek.lol', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, 'keker', user),
            new VideoEntity(1, 1, 'https://admin1.up', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, 'AAA', admin),
            new VideoEntity(1, 2, 'https://admin2.up', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, 'AAA', admin),
            new VideoEntity(1, 3, 'https://admin3.up', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, 'AAA', admin),
            new VideoEntity(1337, 7, 'https://banned.com', VideoKindEnum.DUBBING, 'ru', VideoQualityEnum.TV, '???', banned),
        );

        const videoRepo = await getRepository(VideoEntity);
        await videoRepo.save(seeds);
    }

    public async down(): Promise<void> {
        const videoRepo = await getRepository(VideoEntity);
        await videoRepo.clear();
    }
}
