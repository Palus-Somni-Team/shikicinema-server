import { MigrationInterface, QueryRunner } from 'typeorm';
import { UploadTokenEntity, UploaderEntity } from '@app-entities';

const seeds = [];

export class UploadTokenSeed1650995411336 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const uploaderRepo = await queryRunner.manager.getRepository(UploaderEntity);
        const uploadTokenRepo = await queryRunner.manager.getRepository(UploadTokenEntity);

        const admin = await uploaderRepo.findOneBy({ shikimoriId: '13371337' });
        const user1 = await uploaderRepo.findOneBy({ shikimoriId: '88005553535' });
        const banned = await uploaderRepo.findOneBy({ shikimoriId: '99999999' });

        seeds.push(
            new UploadTokenEntity('admin-test-upload-token', admin, new Date('3000-01-01')),
            new UploadTokenEntity('user1-test-upload-token', user1, new Date('3000-01-01')),
            new UploadTokenEntity('banned-test-upload-token', banned, new Date('3000-01-01')),
        );

        await uploadTokenRepo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const uploadTokenRepo = await queryRunner.manager.getRepository(UploadTokenEntity);
        await uploadTokenRepo.clear();
    }
}
