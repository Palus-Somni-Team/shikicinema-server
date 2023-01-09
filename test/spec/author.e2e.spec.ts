import { AuthorEntity } from '@app-entities';
import { GetAuthorResponse } from '@app-routes/api/author/dto';
import { GetAuthorsRequest } from '@lib-shikicinema';
import { Raw } from 'typeorm';
import { TestEnvironment } from '@e2e/test.environment';
import { normalizeString } from '@app-utils/postgres.utils';

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
            expect(res.data[0]).toStrictEqual({
                id: author.id,
                name: author.name,
            });
            expect(res.limit).toBe(20);
            expect(res.offset).toBe(0);
        },
    );

    it(
        'GET /api/authors should return 200 & first page without query params',
        async () => {
            const authors = await env.dataSource
                .getRepository(AuthorEntity)
                .find({
                    order: { name: 'asc' },
                    skip: 0,
                    take: 20,
                });

            const res = await env.anonClient.getAuthors();
            expect(res.data.length).toBe(authors.length);
            expect(res).toEqual(new GetAuthorResponse(authors, 20, 0));
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
