import { AuthorEntity } from '@app-entities';
import { MigrationInterface, QueryRunner } from 'typeorm';

export const seeds = [
    new AuthorEntity('AniDUB'),
    new AuthorEntity('AniLibria.TV'),
    new AuthorEntity('AnimeVost'),
];

export class AuthorsSeed1621024400000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const repo = await queryRunner.manager.getRepository(AuthorEntity);
        await repo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const repo = await queryRunner.manager.getRepository(AuthorEntity);
        await repo.clear();
    }
}
