import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@lib-shikicinema';

import { Assert } from '@app-utils/validation/assert';
import { CreateUser, UpdateUser } from '@app-services/user/dto';
import { PgException, isPgException, removeUndefinedWhereFields } from '@app-utils/postgres.utils';
import { UserEntity } from '@app-entities';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) {}

    async findById(id: number): Promise<UserEntity> {
        const user = await this.repository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    findByLogin(login: string): Promise<UserEntity> {
        return this.repository.findOne({ where: { login } });
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

        const where = removeUndefinedWhereFields({ id, login, name, email, shikimoriId, roles, createdAt });

        return this.repository.findAndCount({ where, skip: offset, take: limit });
    }

    async create(user: CreateUser): Promise<UserEntity> {
        try {
            const { email, login, password, roles } = user;
            const entity = this.repository.create({
                login, password, email,
                name: login,
                roles: roles || [Role.user],
            });

            // Do not remove await for proper exception handling
            return await this.repository.save(entity);
        } catch (e) {
            if (isPgException(e, PgException.UNIQUE_CONSTRAINS_ERROR)) {
                throw new ConflictException();
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async update(id: number, request: UpdateUser): Promise<UserEntity> {
        const { affected } = await this.repository.update(id, request);

        if (affected === 0) {
            throw new NotFoundException();
        }

        // TODO: maybe we should use transaction for this?
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        const { affected } = await this.repository.delete({ id });

        if (affected === 0) {
            throw new NotFoundException();
        }

        return Promise.resolve();
    }
}
