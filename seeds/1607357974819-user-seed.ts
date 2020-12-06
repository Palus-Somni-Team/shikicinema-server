import { Role } from '@shikicinema';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '../src/services/user/user.entity';

export const seeds = [
  new UserEntity('admin', '12345678', 'admin@email.com', [Role.admin, Role.user]),
  new UserEntity('user1', '12345678', 'user1@email.com', [Role.user]),
  new UserEntity('user2', '12345678', 'user2@email.com', [Role.user]),
  new UserEntity('banned', '12345678', 'banned@email.com', [Role.user, Role.banned]),
];

export class UserSeed21607357974819 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const usersRepo = await getRepository(UserEntity);
        await usersRepo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const usersRepo = await getRepository(UserEntity);
        await usersRepo.clear();
    }

}
