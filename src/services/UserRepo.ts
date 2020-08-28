import bcrypt from 'bcrypt';

import {CreateUserRequest, PaginationRequest, UpdateUserRequest} from '../../lib/shikicinema';
import {Singleton} from './Singleton';
import {UserEntity} from '../models/UserEntity';
import {User} from '../types/User';

class UserRepo extends Singleton<UserRepo> {
    async create(user: CreateUserRequest): Promise<UserEntity> {
        try {
            return UserEntity.create({
                name: user.login,
                login: user.login,
                email: user.email,
                password: await bcrypt.hash(user.password, 10),
                roles: user.roles || ['user'],
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async delete(id: number): Promise<boolean> {
        return UserEntity
            .destroy({where: {id}})
            .then((count) => !!count);
    }

    async findById(id: number): Promise<UserEntity | null> {
        try {
            return !isNaN(id) ? UserEntity.findByPk(id) : Promise.resolve(null);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async findAll(user: Partial<User> = {}, pagination: PaginationRequest = {}): Promise<UserEntity[]> {
        try {
            const where: { [key: string]: any } = {};

            for (const [key, value] of Object.entries(user)) {
                if (value !== undefined) {
                    where[key] = value;
                }
            }

            return UserEntity.findAll({
                where,
                offset: pagination.offset,
                limit: pagination.limit,
            });
        } catch (e) {
            return [];
        }
    }

    async upsert(user: UpdateUserRequest): Promise<UserEntity> {
        const [entity, ok] = await UserEntity.upsert(user, {returning: true});

        return ok
            ? Promise.resolve(entity)
            : Promise.reject(new Error('Cannot upsert user!'));
    }
}

export default UserRepo.getInstance(UserRepo);
