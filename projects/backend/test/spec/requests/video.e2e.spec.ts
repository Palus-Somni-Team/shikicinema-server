import { GetVideoRequestsResponse, VideoRequest } from '~backend/routes/api/requests/video/dto';
import { In } from 'typeorm';
import { TestEnvironment } from '~backend-e2e/test.environment';
import { VideoRequestEntity } from '~backend/entities';
import { VideoRequestStatusEnum, VideoRequestTypeEnum } from '@shikicinema/types';

describe('Video Requests API (e2e)', () => {
    const env = new TestEnvironment();
    env.init();

    describe('GET /api/requests/videos with filters should return 200 & correct data', () => {
        const reviewerLogin = 'admin';
        const creator1Login = 'user1';
        const creator2Login = 'user2';

        const requests = [
            {
                name: 'filter by id',
                req: { id: 1 },
                where: { id: 1 },
            },
            {
                name: 'filter by types',
                req: { types: [VideoRequestTypeEnum.INFO, VideoRequestTypeEnum.DELETE] },
                where: { type: In([VideoRequestTypeEnum.INFO, VideoRequestTypeEnum.DELETE]) },
            },
            {
                name: 'filter by statuses',
                req: { statuses: [VideoRequestStatusEnum.ACTIVE, VideoRequestStatusEnum.APPROVED] },
                where: { status: In([VideoRequestStatusEnum.ACTIVE, VideoRequestStatusEnum.APPROVED]) },
            },
            {
                name: 'filter by creator1',
                req: { createdBy: creator1Login },
                where: { createdBy: { login: creator1Login } },
            },
            {
                name: 'filter by creator2',
                req: { createdBy: creator2Login },
                where: { createdBy: { login: creator2Login } },
            },
            {
                name: 'filter by reviewer',
                req: { reviewedBy: reviewerLogin },
                where: { reviewedBy: { login: reviewerLogin } },
            },
            {
                name: 'empty filter',
                req: {},
            },
        ];

        for (const [index, { req, name, where }] of requests.entries()) {
            it(
                `should return 200 #${index} ${name}`,
                async () => {
                    const [data, total] = await env.dataSource
                        .getRepository(VideoRequestEntity)
                        .findAndCount({
                            skip: 0,
                            take: 20,
                            where,
                            order: { id: 'desc' },
                            relations: ['video', 'author', 'createdBy', 'reviewedBy'],
                        });

                    const res = await env.shikiAuthClient.getVideoRequests(req);

                    // expect(res.data.length).toBeGreaterThan(0);
                    expect(res).toStrictEqual(
                        new GetVideoRequestsResponse(data.map((_) => new VideoRequest(_)), 20, 0, total)
                    );
                },
            );
        }
    },
    );

    describe('GET /api/requests/videos validation test cases', () => {
        const validationTestCases = [
            { req: { id: -1 }, name: 'id is greater or equals to 0' },
            { req: { createdBy: '12' }, name: 'createdBy too short' },
            { req: { createdBy: 'long search'.padEnd(257, '!') }, name: 'createdBy too long' },
            { req: { reviewedBy: '12' }, name: 'createdBy too short' },
            { req: { reviewedBy: 'long search'.padEnd(257, '!') }, name: 'reviewedBy too long' },
            { req: { limit: 101 }, name: 'too big limit' },
            { req: { limit: 0 }, name: 'limit is greater than 0' },
            { req: { offset: -1 }, name: 'offset is greater or equals to 0' },
        ];

        for (const [index, { req, name }] of validationTestCases.entries()) {
            it(
                `should return 400 Bad Request #${index} ${name}`,
                async () => {
                    return env.shikiAuthClient.getVideoRequestsRaw(req).expect(400);
                },
            );
        }
    });
});
