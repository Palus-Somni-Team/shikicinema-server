import { Assert } from '~backend/utils/validation/assert';
import { AuthorEntity } from '~backend/entities';
import { EntityManager, FindManyOptions, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { normalizeString } from '~backend/utils/postgres.utils';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(AuthorEntity)
        private readonly repository: Repository<AuthorEntity>,
    ) {}

    get(name: string, limit: number, offset: number): Promise<[AuthorEntity[], number]> {
        Assert.Argument('limit', limit).between(1, 100);
        Assert.Argument('offset', offset).greaterOrEqualTo(0);

        const queryOptions: FindManyOptions<AuthorEntity> = {
            order: { name: 'asc' },
            take: limit,
            skip: offset,
        };

        if (name) {
            name = normalizeString(name);
            if (name.length > 0) {
                queryOptions.where = {
                    name: Raw((_) => `UPPER(${_}) like :name`, { name: `%${name}%` }),
                };
            }
        }

        return this.repository.findAndCount(queryOptions);
    }

    /**
     * Tries to find author in db and returns it.
     * In case when author not found creates new.
     * @param {EntityManager} entityManager Entity manager.
     * @param {string} author Author's name.
     * @param {boolean} save Whether the entity should be saved to db after creation or not.
     * @return {Promise<AuthorEntity>} Author entity instance.
     */
    public async getOrCreateAuthorEntity(
        entityManager: EntityManager,
        author: string,
        save = false,
    ): Promise<AuthorEntity> {
        Assert.Argument('entityManager', entityManager);
        author = normalizeString(author);
        Assert.Argument('author', author).lengthBetween(1, 256);

        const repo = await entityManager.getRepository(AuthorEntity);
        let entity = await repo.findOneBy({
            name: Raw((_) => `UPPER(${_}) = :name`, { name: author }),
        });

        if (save && !entity) {
            entity = await repo.save(new AuthorEntity(author));
        }

        return entity ?? new AuthorEntity(author);
    }
}
