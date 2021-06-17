import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { UserService } from './user.service';
import { UserEntity } from '@app-entities';
import { CreateUser, GetUserById, GetUsers, UpdateUser } from './dto';

describe('UserService', () => {
  const id = 123;
  const byId = plainToClass(GetUserById, { id });
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(userEntities),
            findOne: jest.fn().mockResolvedValue(oneUserEntity),
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
  });

  describe('findById', () => {
    it('should get a single user', async () => {
      const user = await service.findById(byId);

      expect(user).toStrictEqual(oneUserEntity);
    });

    it('should throw 404 Not Found HttpException', () => {
      repo.findOne = jest.fn().mockResolvedValueOnce(undefined);

      expect(service.findById(byId)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll({} as GetUsers);

      expect(users).toStrictEqual(userEntities);
    });
  });

  describe('create', () => {
    it('should successfully insert a user', async () => {
      const createdUser = await service.create(createQuery);
      expect(createdUser).toStrictEqual(oneUserEntity);
    });

    it('should throw 500 Internal Error HttpException', () => {
      repo.save = jest.fn().mockRejectedValueOnce(new Error('Unexpected Error'));

      expect(service.create(createQuery)).rejects.toThrowError(InternalServerErrorException);
    });

    it('should throw 409 Conflict HttpException', () => {
      repo.save = jest.fn().mockRejectedValueOnce({
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
      const updatedUser = await service.update(byId, updateQuery);

      expect(updatedUser).toStrictEqual(oneUserEntity);
    });

    it('should throw 404 Not Found HttpException', () => {
      repo.update = jest.fn().mockResolvedValueOnce({ raw: [], affected: 0 });

      expect(service.update(byId, updateQuery)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should return undefined', async () => {
      jest
        .spyOn(repo, 'delete')
        .mockResolvedValueOnce({ raw: [], affected: 1 } as DeleteResult);
      const result = await service.delete(byId);

      expect(result).toStrictEqual(undefined);
    });

    it('should throw 404 Not Found HttpException', () => {
      repo.delete = jest.fn().mockResolvedValueOnce({ raw: [], affected: 0 });

      expect(service.delete(byId)).rejects.toThrowError(NotFoundException);
    });
  });
});
