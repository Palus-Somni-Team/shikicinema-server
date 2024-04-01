import { CreateVideoRequestRequest, VideoRequestStatusEnum, VideoRequestTypeEnum } from '@shikicinema/types';
import { RejectVideoRequestRequest } from '~backend/routes/api/admin/requests/video/dto';
import { TestAdminEnvironment } from '~backend-e2e/test.admin.environment';
import { VideoEntity, VideoRequestEntity } from '~backend/entities';

describe('Admin Video Requests (e2e)', () => {
    const user1LoginData = { login: 'user1', password: '12345678' };

    const env = new TestAdminEnvironment();
    env.init();

    describe('PATCH /api/admin/requests/videos/reject', () => {
        it('User must be authorized',
            async () => {
                const res = await env.anonClient.rejectVideoRequestRaw(null);

                expect(res.status).toBe(403);
            },
        );

        it('User must be admin',
            async () => {
                await env.anonClient.login(user1LoginData);
                const res = await env.anonClient.rejectVideoRequestRaw(null);

                expect(res.status).toBe(403);
            },
        );

        it('Returns 404 when there\'s no request',
            async () => {
                // arrange
                const req: RejectVideoRequestRequest = {
                    id: 404,
                };

                // act
                const response = await env.adminClient.rejectVideoRequestRaw(req);

                // assert
                expect(response.status).toBe(404);
                expect(response.body.message).toBe('request is not found.');
            },
        );

        it('Returns 400 when reject request with final status',
            async () => {
                // arrange
                const entity = await env.dataSource.getRepository(VideoRequestEntity).findOneBy({
                    status: VideoRequestStatusEnum.APPROVED,
                });

                const req: RejectVideoRequestRequest = {
                    id: entity.id,
                };

                // act
                const response = await env.adminClient.rejectVideoRequestRaw(req);

                // assert
                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Only active request can be rejected.');
            },
        );

        it('Should return 200 and correct data',
            async () => {
                // arrange
                const video = await env.dataSource.getRepository(VideoEntity).findOneBy({ animeId: 1 });
                const createReq: CreateVideoRequestRequest = {
                    videoId: video.id,
                    type: VideoRequestTypeEnum.INFO,
                    comment: 'test comment',
                };

                const res = await env.shikiAuthClient.createVideoRequests(createReq);
                const req: RejectVideoRequestRequest = {
                    id: res.id,
                    comment: null,
                };

                // act
                const response = await env.adminClient.rejectVideoRequest(req);

                // assert
                const videoRequest = await env.dataSource
                    .getRepository(VideoRequestEntity)
                    .findOne({ where: { id: res.id }, relations: ['reviewedBy'] });
                expect(videoRequest).not.toBeNull();

                expect(videoRequest.status).toBe(VideoRequestStatusEnum.REJECTED);
                expect(videoRequest.reviewedBy.login).toBe(TestAdminEnvironment.AdminLoginData.login);
                expect(videoRequest.reviewerComment).toBe(req.comment);

                expect(response.status).toBe(VideoRequestStatusEnum.REJECTED);
                expect(response.reviewedBy.login).toBe(TestAdminEnvironment.AdminLoginData.login);
                expect(response.reviewerComment).toBe(req.comment);
            },
        );
    });

    describe('PATCH /api/admin/requests/videos/reject validation test cases', () => {
        const validationTestCases = [
            { req: { id: -1, comment: 'any'.padEnd(15, '!') }, name: 'id is greater or equals to 0' },
            { req: { id: 0, comment: 'long'.padEnd(1002, '!') }, name: 'comment to long' },
        ];

        for (const [index, { req, name }] of validationTestCases.entries()) {
            it(
                `should return 400 Bad Request #${index} ${name}`,
                async () => {
                    return env.adminClient.rejectVideoRequestRaw(req).expect(400);
                },
            );
        }
    });
});
