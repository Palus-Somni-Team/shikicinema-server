import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import {
    CreateUser,
    UpdateUser,
} from '~backend/services/user/dto';
import { UploaderService } from '~backend/services/uploader/uploader.service';
import { UserEntity } from '~backend/entities';
import { UserService } from '~backend/services/user/user.service';

describe('UserService', () => {
    const id = 123;
    const oneUserEntity = new UserEntity('user1', '12345678', 'user1@email.com');
    const userEntities = [
        new UserEntity('user2', '12345678', 'user2email.com'),
        new UserEntity('user3', '12345678', 'user3email.com'),
        new UserEntity('user4', '12345678', 'user4email.com'),
    ];
    const createQuery = {
        login: oneUserEntity.login,
        email: oneUserEntity.email,
        password: oneUserEntity.password,
    } as CreateUser;
    const updateQuery = plainToClass(UpdateUser, {
        name: 'new_name',
    } as UpdateUser);
    let service: UserService;
    let repo: Repository<UserEntity>;
    let dataSource: DataSource;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: DataSource,
                    useValue: {
                        transaction: jest.fn().mockResolvedValue(oneUserEntity),
                    },
                },
                {
                    provide: UploaderService,
                    useValue: jest.fn(),
                },
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        find: jest.fn().mockResolvedValue(userEntities),
                        findAndCount: jest.fn().mockResolvedValue([userEntities, userEntities.length]),
                        findOne: jest.fn().mockResolvedValue(oneUserEntity),
                        findOneBy: jest.fn().mockResolvedValue(oneUserEntity),
                        create: jest.fn().mockReturnValue(oneUserEntity),
                        save: jest.fn().mockReturnValue(oneUserEntity),
                        update: jest.fn().mockResolvedValue(true),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repo = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
        dataSource = module.get<DataSource>(DataSource);
    });

    describe('findById', () => {
        it('should get a single user', async () => {
            const user = await service.findById(id);

            expect(user).toStrictEqual(oneUserEntity);
        });

        it('should throw 404 Not Found HttpException', () => {
            repo.findOne = jest.fn().mockResolvedValueOnce(undefined);

            expect(service.findById(id)).rejects.toThrowError(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const [users, total] = await service.findAll(userEntities.length, 0);

            expect(users).toStrictEqual(userEntities);
            expect(total).toStrictEqual(userEntities.length);
        });
    });

    describe('create', () => {
        it('should successfully insert a user', async () => {
            const createdUser = await service.create(createQuery);
            expect(createdUser).toStrictEqual(oneUserEntity);
        });

        it('should throw 500 Internal Error HttpException', () => {
            dataSource.transaction = jest.fn().mockRejectedValueOnce(new Error('Unexpected Error'));

            expect(service.create(createQuery)).rejects.toThrowError(InternalServerErrorException);
        });

        it('should throw 409 Conflict HttpException', () => {
            dataSource.transaction = jest.fn().mockRejectedValueOnce({
                message: 'duplicate key violates unique constraint "users_email_key"',
                length: 307,
                name: 'QueryFailedError',
                severity: 'ERROR',
                code: '23505',
                detail: 'Key "(email)=(user3@gmail.com)" already exists.',
                schema: 'public',
                table: 'users',
                constraint: 'users_email_key',
                file: 'nbtinsert.c',
            });

            expect(service.create(createQuery)).rejects.toThrowError(ConflictException);
        });
    });

    describe('update', () => {
        it('should call the update method', async () => {
            const updatedUser = await service.update(id, updateQuery);

            expect(updatedUser).toStrictEqual(oneUserEntity);
        });

        it('should throw 404 Not Found HttpException', () => {
            dataSource.transaction = jest.fn().mockRejectedValueOnce(new NotFoundException());

            expect(service.update(id, updateQuery)).rejects.toThrowError(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should return undefined', async () => {
            jest
                .spyOn(repo, 'delete')
                .mockResolvedValueOnce({ raw: [], affected: 1 } as DeleteResult);
            const result = await service.delete(id);

            expect(result).toStrictEqual(undefined);
        });

        it('should throw 404 Not Found HttpException', () => {
            repo.delete = jest.fn().mockResolvedValueOnce({ raw: [], affected: 0 });

            expect(service.delete(id)).rejects.toThrowError(NotFoundException);
        });
    });
});
