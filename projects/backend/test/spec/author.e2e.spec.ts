import { Author, GetAuthorResponse } from '~backend/routes/api/author/dto';
import { AuthorEntity } from '~backend/entities';
import { GetAuthorsRequest } from '@shikicinema/types';
import { Raw } from 'typeorm';
import { TestEnvironment } from '~backend-root/test/test.environment';
import { normalizeString } from '~backend/utils/postgres.utils';

describe('Authors API (e2e)', () => {
    const env = new TestEnvironment();
    env.init();

    it(
        'GET /api/authors should return 200 & correct data',
        async () => {
            const req: GetAuthorsRequest = { name: 'anidub' };

            const author = await env.dataSource
                .getRepository(AuthorEntity)
                .findOneBy({
                    name: Raw((_) => `UPPER(${_}) like :name`, { name: `%${normalizeString(req.name)}%` }),
                });

            const res = await env.anonClient.getAuthors(req);

            expect(res.data.length).toBe(1);
            expect(res.data[0]).toStrictEqual(new Author(author));
            expect(res.limit).toBe(20);
            expect(res.offset).toBe(0);
            expect(res.total).toBe(1);
        },
    );

    it(
        'GET /api/authors should return 200 & first page without query params',
        async () => {
            const [authors, total] = await env.dataSource
                .getRepository(AuthorEntity)
                .findAndCount({
                    order: { name: 'asc' },
                    skip: 0,
                    take: 20,
                });

            const res = await env.anonClient.getAuthors();
            expect(res.data.length).toBe(authors.length);
            expect(res).toStrictEqual(new GetAuthorResponse(authors.map((_) => new Author(_)), 20, 0, total));
        },
    );

    describe('GET /api/authors validation test cases', () => {
        const validationTestCases = [
            { req: { name: '' }, name: 'empty search' },
            { req: { name: 'long search'.padEnd(257, '!') }, name: 'too long name' },
            { req: { limit: 101 }, name: 'too big limit' },
            { req: { limit: 0 }, name: 'limit is greater than 0' },
            { req: { offset: -1 }, name: 'offset is greater or equals to 0' },
        ];

        for (const [index, { req, name }] of validationTestCases.entries()) {
            it(
                `should return 400 Bad Request #${index} ${name}`,
                async () => {
                    return env.anonClient.getAuthorsRaw(req).expect(400);
                },
            );
        }
    });
});
