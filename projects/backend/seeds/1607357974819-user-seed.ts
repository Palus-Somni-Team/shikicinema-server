import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '~backend/entities';

const seeds = [
    new UserEntity('admin', '12345678', 'admin@email.com', null),
    new UserEntity('user1', '12345678', 'user1@email.com', null),
    new UserEntity('user2', '12345678', 'user2@email.com', null),
    new UserEntity('banned', '12345678', 'banned@email.com', null),
    new UserEntity('user3', '12345678', 'user3@email.com', null),
    new UserEntity('user4', '12345678', 'user4@email.com', null),
    new UserEntity('user5', '12345678', 'user5@email.com', null),
    new UserEntity('user6', '12345678', 'user6@email.com', null),
    new UserEntity('user7', '12345678', 'user7@email.com', null),
    new UserEntity('user8', '12345678', 'user8@email.com', null),
    new UserEntity('user9', '12345678', 'user9@email.com', null),
    new UserEntity('user0', '12345678', 'user0@email.com', null),
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
