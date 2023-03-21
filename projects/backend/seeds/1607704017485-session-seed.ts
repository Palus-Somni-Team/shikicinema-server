import { MigrationInterface, QueryRunner } from 'typeorm';
import { SessionEntity } from '~backend/entities';

const expireDateMsTomorrow = Date.now() + 24 * 60 * 60 * 1000;
const sessionData = {
    cookie: {
        originalMaxAge: 86400000,
        expires: new Date(expireDateMsTomorrow),
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
    },
    passport: {
        user: 1,
    },
};

export const seeds = [
    new SessionEntity('1', expireDateMsTomorrow, JSON.stringify(sessionData)),
];

export class SessionSeed1607704017485 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const sessionRepo = await queryRunner.manager.getRepository(SessionEntity);
        await sessionRepo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sessionRepo = await queryRunner.manager.getRepository(SessionEntity);
        await sessionRepo.clear();
    }
}
