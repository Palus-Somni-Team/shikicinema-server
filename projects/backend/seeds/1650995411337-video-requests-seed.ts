import { MigrationInterface, QueryRunner } from 'typeorm';
import {
    UploaderEntity,
    UserEntity,
    VideoEntity,
    VideoRequestEntity,
} from '~backend/entities';
import { VideoRequestStatusEnum, VideoRequestTypeEnum } from '@shikicinema/types';

const seeds = [];

export class VideoRequestsSeed1650995411337 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const videoReqsRepo = await queryRunner.manager.getRepository(VideoRequestEntity);
        const videosRepo = await queryRunner.manager.getRepository(VideoEntity);
        const usersRepo = await queryRunner.manager.getRepository(UserEntity);
        const uplodersRepo = await queryRunner.manager.getRepository(UploaderEntity);

        const videos = await videosRepo.find({ relations: ['author'] });
        const admin = await usersRepo.findOne({ where: { login: 'admin' } });
        const user1Uploader = await uplodersRepo.findOne({ where: { shikimoriId: '88005553535' } });
        const adminUploader = await uplodersRepo.findOne({ where: { shikimoriId: '13371337' } });

        seeds.push(
            new VideoRequestEntity(
                VideoRequestTypeEnum.INFO,
                VideoRequestStatusEnum.ACTIVE,
                undefined,
                undefined,
                undefined,
                undefined,
                'Some information',
                undefined,
                videos[0],
                undefined,
                user1Uploader,
                null,
            ),
            new VideoRequestEntity(
                VideoRequestTypeEnum.DELETE,
                VideoRequestStatusEnum.REJECTED,
                undefined,
                undefined,
                undefined,
                undefined,
                'Remove this shit!',
                'No! It\'s my favorite anime!',
                videos[0],
                undefined,
                adminUploader,
                admin,
            ),
            new VideoRequestEntity(
                VideoRequestTypeEnum.UPDATE,
                VideoRequestStatusEnum.APPROVED,
                videos[1].episode,
                videos[1].kind,
                videos[1].quality,
                videos[1].language,
                'Everything is wrong :/',
                '¯\\_(ツ)_/¯',
                videos[1],
                videos[1].author,
                user1Uploader,
                admin,
            ),
        );

        await videoReqsRepo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const videoReqsRepo = await queryRunner.manager.getRepository(VideoRequestEntity);
        await videoReqsRepo.clear();
    }
}
