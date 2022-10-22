import { AuthorEntity } from '@app-entities';
import { FindManyOptions, Raw, Repository } from 'typeorm';
import { GetAuthorResponse } from '@app-routes/api/author/dto/GetAuthorResponse';
import { GetAuthorsRequest } from '@app-routes/api/author/dto/GetAuthorsRequest';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(AuthorEntity)
        private readonly repository: Repository<AuthorEntity>,
    ) {}

    async get(query: GetAuthorsRequest): Promise<GetAuthorResponse> {
        const limit = query.limit ?? 20;
        const offset = query.offset ?? 0;
        const queryOptions: FindManyOptions<AuthorEntity> = {
            order: { id: 'asc' },
            take: limit,
            skip: offset,
        };

        if (query.name && query.name.trim().length > 0) {
            queryOptions.where = {
                name: Raw((_) => `UPPER(${_}) like :name`, { name: `%${query.name.trim().toUpperCase()}%` }),
            };
        }

        return new GetAuthorResponse(await this.repository.find(queryOptions), limit, offset);
    }
}
