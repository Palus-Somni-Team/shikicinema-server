import { MigrationInterface, QueryRunner } from 'typeorm';

import { UploaderEntity, UserEntity } from '~backend/entities';

const seeds = [];

export class UploaderSeed1621024303293 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepo = await queryRunner.manager.getRepository(UserEntity);
        const admin = await userRepo.findOneBy({ login: 'admin' });
        const user1 = await userRepo.findOneBy({ login: 'user1' });
        const banned = await userRepo.findOneBy({ login: 'banned' });

        seeds.push(
            new UploaderEntity('278015', null, []),
            new UploaderEntity('13371337', admin, []),
            new UploaderEntity('88005553535', user1, []),
            new UploaderEntity('99999999', banned, [], true),
            new UploaderEntity('has-no-user-1', null, []),
            new UploaderEntity('has-no-user-2', null, []),
            new UploaderEntity('has-no-user-3', null, []),
            new UploaderEntity('has-no-user-4', null, []),
            new UploaderEntity('has-no-user-5', null, []),
            new UploaderEntity('has-no-user-6', null, []),
            new UploaderEntity('has-no-user-7', null, []),
            new UploaderEntity('has-no-user-8', null, []),
            new UploaderEntity('has-no-user-9', null, []),
            new UploaderEntity('has-no-user-0', null, []),
        );

        const uploaderRepo = await queryRunner.manager.getRepository(UploaderEntity);
        await uploaderRepo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const uploaderRepo = await queryRunner.manager.getRepository(UploaderEntity);
        await uploaderRepo.clear();
    }
}
