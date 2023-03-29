import { MigrationInterface, QueryRunner } from 'typeorm';

import { UploaderEntity, UserEntity } from '~backend/entities';

const seeds = [
    new UploaderEntity('278015', null, []),
];

export class UploaderSeed1621024303293 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepo = await queryRunner.manager.getRepository(UserEntity);
        const admin = await userRepo.findOneBy({ login: 'admin' });
        const user1 = await userRepo.findOneBy({ login: 'user1' });
        const banned = await userRepo.findOneBy({ login: 'banned' });

        seeds.push(
            new UploaderEntity('13371337', admin, []),
            new UploaderEntity('88005553535', user1, []),
            new UploaderEntity('99999999', banned, []),
        );

        const uploaderRepo = await queryRunner.manager.getRepository(UploaderEntity);
        await uploaderRepo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const uploaderRepo = await queryRunner.manager.getRepository(UploaderEntity);
        await uploaderRepo.clear();
    }
}
