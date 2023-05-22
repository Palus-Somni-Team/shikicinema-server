import { GetVideoRequestsResponse, VideoRequest } from '~backend/routes/api/requests/video/dto';
import { In } from 'typeorm';
import { TestEnvironment } from '~backend-e2e/test.environment';
import { UserEntity, VideoRequestEntity } from '~backend/entities';
import { VideoRequestStatusEnum, VideoRequestTypeEnum } from '@shikicinema/types';

describe('Video Requests API (e2e)', () => {
    const env = new TestEnvironment();
    env.init();

    describe('GET /api/requests/videos with filters should return 200 & correct data', () => {
        const testCases = {
            'filter by id': undefined,
            'filter by types': undefined,
            'filter by statuses': undefined,
            'filter by creator1': undefined,
            'filter by creator2': undefined,
            'filter by reviewer': undefined,
            'empty filter': undefined,
        };

        beforeAll(async () => {
            const userRepo = env.dataSource.getRepository(UserEntity);
            const reviewer = await userRepo.findOneBy({ login: 'admin' });
            const creator1 = await userRepo.findOneBy({ login: 'user1' });
            const creator2 = await userRepo.findOneBy({ login: 'user2' });

            testCases['filter by id'] = {
                req: { id: 1 },
                where: { id: 1 },
            };

            testCases['filter by types'] = {
                req: { types: [VideoRequestTypeEnum.INFO, VideoRequestTypeEnum.DELETE] },
                where: { type: In([VideoRequestTypeEnum.INFO, VideoRequestTypeEnum.DELETE]) },
            };

            testCases['filter by statuses'] = {
                req: { statuses: [VideoRequestStatusEnum.ACTIVE, VideoRequestStatusEnum.APPROVED] },
                where: { status: In([VideoRequestStatusEnum.ACTIVE, VideoRequestStatusEnum.APPROVED]) },
            };

            testCases['filter by creator1'] = {
                req: { createdBy: creator1.id },
                where: { createdBy: { id: creator1.id } },
            };

            testCases['filter by creator2'] = {
                req: { createdBy: creator2.id },
                where: { createdBy: { id: creator2.id } },
            };

            testCases['filter by reviewer'] = {
                req: { reviewedBy: reviewer.id },
                where: { reviewedBy: { id: reviewer.id } },
            };

            testCases['empty filter'] = {
                req: {},
            };
        });

        for (const [index, name] of Object.keys(testCases).entries()) {
            it(
                `should return 200 #${index} ${name}`,
                async () => {
                    const [data, total] = await env.dataSource
                        .getRepository(VideoRequestEntity)
                        .findAndCount({
                            skip: 0,
                            take: 20,
                            where: testCases[name].where,
                            order: { id: 'desc' },
                            relations: ['video', 'author', 'createdBy', 'reviewedBy'],
                        });

                    const res = await env.shikiAuthClient.getVideoRequests(testCases[name].req);

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
            { req: { createdBy: -1 }, name: 'createdBy is greater or equals to 0' },
            { req: { reviewedBy: -1 }, name: 'reviewedBy is greater or equals to 0' },
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
