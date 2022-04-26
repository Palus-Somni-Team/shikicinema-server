import { MigrationInterface, getRepository } from 'typeorm';
import { UploadTokenEntity, UploaderEntity } from '@app-entities';

const seeds = [];

export class UploadTokenSeed1650995411336 implements MigrationInterface {
    public async up(): Promise<void> {
        const uploaderRepo = await getRepository(UploaderEntity);
        const uploadTokenRepo = await getRepository(UploadTokenEntity);

        const admin = await uploaderRepo.findOne({ shikimoriId: '13371337' });
        const user1 = await uploaderRepo.findOne({ shikimoriId: '88005553535' });
        const banned = await uploaderRepo.findOne({ shikimoriId: '99999999' });

        seeds.push(
            new UploadTokenEntity('admin-test-upload-token', admin, new Date('3000-01-01')),
            new UploadTokenEntity('user1-test-upload-token', user1, new Date('3000-01-01')),
            new UploadTokenEntity('banned-test-upload-token', banned, new Date('3000-01-01')),
        );

        await uploadTokenRepo.save(seeds);
    }

    public async down(): Promise<void> {
        const uploadTokenRepo = await getRepository(UploadTokenEntity);
        await uploadTokenRepo.clear();
    }
}
