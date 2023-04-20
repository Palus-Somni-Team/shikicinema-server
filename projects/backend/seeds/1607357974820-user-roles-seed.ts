import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '@shikicinema/types';
import { UserEntity, UserRolesEntity } from '~backend/entities';

const seeds = [];

export class UserRolesSeed1607357974820 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepo = await queryRunner.manager.getRepository(UserEntity);
        const userRolesRepo = await queryRunner.manager.getRepository(UserRolesEntity);

        const admin = await userRepo.findOneByOrFail({ login: 'admin' });
        const user1 = await userRepo.findOneByOrFail({ login: 'user1' });
        const user2 = await userRepo.findOneByOrFail({ login: 'user2' });
        const banned = await userRepo.findOneByOrFail({ login: 'banned' });

        seeds.push(
            // admin roles
            new UserRolesEntity(admin, Role.user),
            new UserRolesEntity(admin, Role.admin),

            // user1 roles
            new UserRolesEntity(user1, Role.user),

            // user2 roles
            new UserRolesEntity(user2, Role.user),

            // banned roles
            new UserRolesEntity(banned, Role.user),
            new UserRolesEntity(banned, Role.banned),
        );

        await userRolesRepo.save(seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userRolesRepo = await queryRunner.manager.getRepository(UserRolesEntity);
        await userRolesRepo.clear();
    }
}
