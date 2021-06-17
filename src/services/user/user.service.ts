import { Role } from '@lib-shikicinema';
import { parseWhere } from '@app-utils/where-parser.utils';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app-entities';
import { CreateUser, GetUserById, GetUsers, UpdateUser } from './dto';
import { isPgException, PgException } from '@app-utils/postgres.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: GetUserById): Promise<UserEntity> {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  findByLogin(login: string): Promise<UserEntity> {
    return this.repository.findOne({ where: { login } });
  }

  findAll(query: GetUsers): Promise<UserEntity[]> {
    const { where, limit, offset } = parseWhere(query);

    return this.repository.find({
      where,
      skip: offset ?? 0,
      take: limit || 20,
    });
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

  async update(params: GetUserById, request: UpdateUser): Promise<UserEntity> {
    const { id } = params;
    const { affected } = await this.repository.update(id, request);

    if (affected === 0) {
      throw new NotFoundException();
    }

    // TODO: maybe we should use transaction for this?
    return this.findById(params);
  }

  async delete(params: GetUserById): Promise<void> {
    const { id } = params;
    const { affected } = await this.repository.delete({ id });

    if (affected === 0) {
      throw new NotFoundException();
    }

    return Promise.resolve();
  }
}
