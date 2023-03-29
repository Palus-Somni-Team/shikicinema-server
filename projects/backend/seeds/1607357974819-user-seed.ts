import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '@shikicinema/types';
import { UserEntity } from '~backend/entities';

export const seeds = [
    new UserEntity('admin', '12345678', 'admin@email.com', [Role.admin, Role.user]),
    new UserEntity('user1', '12345678', 'user1@email.com', [Role.user]),
    new UserEntity('user2', '12345678', 'user2@email.com', [Role.user]),
    new UserEntity('banned', '12345678', 'banned@email.com', [Role.user, Role.banned]),
];

export class UserSeed21607357974819 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const usersRepo = await queryRunner.manager.getRepository(UserEntity);
        await usersRepo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const usersRepo = await queryRunner.manager.getRepository(UserEntity);
        await usersRepo.clear();
    }
}
