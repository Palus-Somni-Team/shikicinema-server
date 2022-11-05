import { Assert } from '@app-utils/validation/assert';
import { AuthorEntity } from '@app-entities';
import { FindManyOptions, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { normalizeString } from '@app-utils/postgres.utils';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(AuthorEntity)
        private readonly repository: Repository<AuthorEntity>,
    ) {}

    get(name: string, limit: number, offset: number): Promise<AuthorEntity[]> {
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

        return this.repository.find(queryOptions);
    }
}
