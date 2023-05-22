import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@shikicinema/types';

import { Assert } from '~backend/utils/validation/assert';
import { CreateUser, UpdateUser } from '~backend/services/user/dto';
import {
    PgException,
    isPgException,
    toSqlWhere,
} from '~backend/utils/postgres.utils';
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
        const user = await this.repository.findOne({ where: { id }, relations: ['roles', 'uploader'] });

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    findByLogin(login: string): Promise<UserEntity> {
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
        Assert.Argument('limit', limit).between(1, 100);
        Assert.Argument('offset', offset).greaterOrEqualTo(0);

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

            if (!userEntity) {
                throw new NotFoundException();
            }

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
        const { affected } = await this.repository.delete({ id });

        if (affected === 0) {
            throw new NotFoundException();
        }
    }
}
