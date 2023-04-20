import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '~backend/entities';

const seeds = [
    new UserEntity('admin', '12345678', 'admin@email.com'),
    new UserEntity('user1', '12345678', 'user1@email.com'),
    new UserEntity('user2', '12345678', 'user2@email.com'),
    new UserEntity('banned', '12345678', 'banned@email.com'),
];

export class UserSeed1607357974819 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const usersRepo = await queryRunner.manager.getRepository(UserEntity);
        await usersRepo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const usersRepo = await queryRunner.manager.getRepository(UserEntity);
        await usersRepo.clear();
    }
}
