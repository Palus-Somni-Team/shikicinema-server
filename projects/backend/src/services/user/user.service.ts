import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@shikicinema/types';

import { CreateUser, UpdateUser } from '~backend/services/user/dto';
import { DevAssert } from '~backend/utils/checks/dev/dev-assert';
import {
    PgException,
    isPgException,
    toSqlWhere,
} from '~backend/utils/postgres.utils';
import { UserAssert } from '~backend/utils/checks/user/user-assert';
import { UserEntity } from '~backend/entities';
import { UserRolesEntity } from '~backend/entities/user-roles';
import { plainRoleMapToUserRolesEntity } from '~backend/utils/class-transform.utils';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private readonly dataSource: DataSource,
    ) {}

    async findById(id: number): Promise<UserEntity> {
        DevAssert.Check('id', id).notNull().greaterOrEqualTo(0);

        const user = await this.repository.findOne({ where: { id }, relations: ['roles', 'uploader'] });

        UserAssert.Check('user', user).exists();

        return user;
    }

    findByLogin(login: string): Promise<UserEntity> {
        DevAssert.Check('login', login).notNull().notEmpty();

        return this.repository.findOneBy({ login });
    }

    findAll(
        limit: number,
        offset: number,
        id?: number,
        login?: string,
        name?: string,
        email?: string,
        shikimoriId?: string | null,
        roles?: Role[],
        createdAt?: Date,
    ): Promise<[UserEntity[], number]> {
        DevAssert.Check('limit', limit).notNull().between(1, 100);
        DevAssert.Check('offset', offset).notNull().greaterOrEqualTo(0);

        const where = toSqlWhere({
            id,
            login,
            name,
            email,
            shikimoriId,
            roles: roles ? { role: In(roles) } : roles,
            createdAt,
        });

        return this.repository.findAndCount({ where, skip: offset, take: limit });
    }

    async create(user: CreateUser): Promise<UserEntity> {
        DevAssert.Check('user', user).notNull();

        try {
            return await this.dataSource.transaction(async (entityManager) => {
                const usersRepo = entityManager.getRepository(UserEntity);
                const rolesRepo = entityManager.getRepository(UserRolesEntity);
                const { email, login, password, roles } = user;
                const userEntity = await usersRepo.save(new UserEntity(login, password, email));

                userEntity.roles = await rolesRepo.save(
                    plainRoleMapToUserRolesEntity(userEntity, roles || [Role.user])
                );

                return userEntity;
            });
        } catch (e) {
            if (isPgException(e, PgException.UNIQUE_CONSTRAINS_ERROR)) {
                throw new ConflictException();
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async update(id: number, request: UpdateUser): Promise<UserEntity> {
        DevAssert.Check('id', id).notNull().greaterOrEqualTo(0);
        DevAssert.Check('request', request).notNull();

        const {
            email,
            roles,
            password,
            name,
        } = request;

        return this.dataSource.transaction(async (entityManager) => {
            const usersRepo = await entityManager.getRepository(UserEntity);
            const rolesRepo = await entityManager.getRepository(UserRolesEntity);
            const userEntity = await usersRepo.findOne({ where: { id }, relations: ['roles', 'uploader'] });

            UserAssert.Check('user', userEntity).exists();

            userEntity.email = email ?? userEntity.email;
            userEntity.password = password ?? userEntity.password;
            userEntity.name = name ?? userEntity.name;

            await usersRepo.save(userEntity);

            if (roles) {
                await rolesRepo.delete({ userId: userEntity.id });
                userEntity.roles = await rolesRepo.save(plainRoleMapToUserRolesEntity(userEntity, roles));
            }

            return userEntity;
        });
    }

    async delete(id: number): Promise<void> {
        DevAssert.Check('id', id).notNull().greaterOrEqualTo(0);

        const { affected } = await this.repository.delete({ id });

        if (affected === 0) {
            throw new NotFoundException();
        }
    }
}
