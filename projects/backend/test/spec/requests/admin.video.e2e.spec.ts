import { ApproveVideoRequestRequest, RejectVideoRequestRequest } from '~backend/routes/api/admin/requests/video/dto';
import {
    CreateVideoRequestRequest,
    VideoKindEnum,
    VideoQualityEnum,
    VideoRequestStatusEnum,
    VideoRequestTypeEnum,
} from '@shikicinema/types';
import { TestAdminEnvironment } from '~backend-e2e/test.admin.environment';
import { VideoEntity, VideoRequestEntity } from '~backend/entities';
import {
    VideoRequest,
} from '~backend/routes/api/requests/video/dto';

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

    async function assertApproveResponse(
        req: ApproveVideoRequestRequest,
        response: VideoRequest): Promise<VideoRequestEntity> {
        const videoRequest = await env.dataSource
            .getRepository(VideoRequestEntity)
            .findOne({ where: { id: response.id }, relations: ['reviewedBy', 'author'] });
        expect(videoRequest).not.toBeNull();

        expect(videoRequest.status).toBe(VideoRequestStatusEnum.APPROVED);
        expect(videoRequest.reviewedBy.login).toBe(TestAdminEnvironment.AdminLoginData.login);
        expect(videoRequest.reviewerComment).toBe(req.comment);

        expect(response.status).toBe(VideoRequestStatusEnum.APPROVED);
        expect(response.reviewedBy.login).toBe(TestAdminEnvironment.AdminLoginData.login);
        expect(response.reviewerComment).toBe(req.comment);

        return videoRequest;
    }

    async function approveRequest(id: number): Promise<VideoRequestEntity> {
        const req: ApproveVideoRequestRequest = { id, comment: 'accepted' };
        const response = await env.adminClient.approveVideoRequest(req);

        return assertApproveResponse(req, response);
    }

    describe('PATCH /api/admin/requests/videos/approve', () => {
        it('User must be authorized',
            async () => {
                const res = await env.anonClient.approveVideoRequestRaw(null);

                expect(res.status).toBe(403);
            },
        );

        it('User must be admin',
            async () => {
                await env.anonClient.login(user1LoginData);
                const res = await env.anonClient.approveVideoRequestRaw(null);

                expect(res.status).toBe(403);
            },
        );

        it('Returns 404 when there\'s no request',
            async () => {
                // arrange
                const req: ApproveVideoRequestRequest = {
                    id: 404,
                };

                // act
                const response = await env.adminClient.approveVideoRequestRaw(req);

                // assert
                expect(response.status).toBe(404);
                expect(response.body.message).toBe('request is not found.');
            },
        );

        it('Returns 400 when approve request with final status',
            async () => {
                // arrange
                const entity = await env.dataSource.getRepository(VideoRequestEntity).findOneBy({
                    status: VideoRequestStatusEnum.APPROVED,
                });

                const req: ApproveVideoRequestRequest = {
                    id: entity.id,
                };

                // act
                const response = await env.adminClient.approveVideoRequestRaw(req);

                // assert
                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Only active request can be approved.');
            },
        );

        it('Should return 200 and mark video as deleted',
            async () => {
                // arrange
                const videoRepo = env.dataSource.getRepository(VideoEntity);
                const video = await videoRepo.findOne({
                    where: { animeId: 1 },
                    relations: ['author'],
                });
                const createReq: CreateVideoRequestRequest = {
                    videoId: video.id,
                    type: VideoRequestTypeEnum.DELETE,
                };
                const res = await env.shikiAuthClient.createVideoRequests(createReq);

                // act
                await approveRequest(res.id);

                // assert
                const newVideo = await videoRepo.findOne({
                    where: { id: video.id },
                    relations: ['author'],
                    withDeleted: true,
                });

                expect(newVideo.episode).toBe(video.episode);
                expect(newVideo.deletedAt).toBeTruthy();
                expect(newVideo.kind).toBe(video.kind);
                expect(newVideo.quality).toBe(video.quality);
                expect(newVideo.language).toBe(video.language);
                expect(newVideo.author).toStrictEqual(video.author);
            },
        );

        it('Should return 200 and do nothing with video',
            async () => {
                // arrange
                const videoRepo = env.dataSource.getRepository(VideoEntity);
                const video = await videoRepo.findOne({
                    where: { animeId: 1 },
                    relations: ['author'],
                });
                const createReq: CreateVideoRequestRequest = {
                    videoId: video.id,
                    type: VideoRequestTypeEnum.INFO,
                    comment: 'comment',
                };
                const res = await env.shikiAuthClient.createVideoRequests(createReq);

                // act
                await approveRequest(res.id);

                // assert
                const newVideo = await videoRepo.findOne({
                    where: { id: video.id },
                    relations: ['author'],
                });

                expect(newVideo.episode).toBe(video.episode);
                expect(newVideo.kind).toBe(video.kind);
                expect(newVideo.quality).toBe(video.quality);
                expect(newVideo.language).toBe(video.language);
                expect(newVideo.author).toStrictEqual(video.author);
            },
        );
    });

    describe('PATCH /api/admin/requests/videos/approve updates video', () => {
        it('Should return 200 and update video episode',
            async () => {
                // arrange
                const videoRepo = env.dataSource.getRepository(VideoEntity);
                const video = await videoRepo.findOne({
                    where: { animeId: 1 },
                    relations: ['author'],
                });
                const createReq: CreateVideoRequestRequest = {
                    videoId: video.id,
                    type: VideoRequestTypeEnum.UPDATE,
                    episode: video.episode + 1,
                };
                const res = await env.shikiAuthClient.createVideoRequests(createReq);

                // act
                const videoRequest = await approveRequest(res.id);

                // assert
                const newVideo = await videoRepo.findOne({
                    where: { id: video.id },
                    relations: ['author'],
                });

                expect(newVideo.episode).toBe(videoRequest.episode);
                expect(newVideo.kind).toBe(video.kind);
                expect(newVideo.quality).toBe(video.quality);
                expect(newVideo.language).toBe(video.language);
                expect(newVideo.author).toStrictEqual(video.author);
            },
        );

        it('Should return 200 and update video kind',
            async () => {
                // arrange
                const videoRepo = env.dataSource.getRepository(VideoEntity);
                const video = await videoRepo.findOne({
                    where: { animeId: 1 },
                    relations: ['author'],
                });
                const createReq: CreateVideoRequestRequest = {
                    videoId: video.id,
                    type: VideoRequestTypeEnum.UPDATE,
                    kind: video.kind === VideoKindEnum.SUBTITLES ? VideoKindEnum.ORIGINAL : VideoKindEnum.SUBTITLES,
                };

                const res = await env.shikiAuthClient.createVideoRequests(createReq);

                // act
                const videoRequest = await approveRequest(res.id);
                const newVideo = await videoRepo.findOne({
                    where: { id: video.id },
                    relations: ['author'],
                });

                expect(newVideo.kind).toBe(videoRequest.kind);
                expect(newVideo.episode).toBe(video.episode);
                expect(newVideo.quality).toBe(video.quality);
                expect(newVideo.author).toStrictEqual(video.author);
                expect(newVideo.language).toBe(video.language);
            },
        );

        it('Should return 200 and update video quality',
            async () => {
                // arrange
                const videoRepo = env.dataSource.getRepository(VideoEntity);
                const video = await videoRepo.findOne({
                    where: { animeId: 1 },
                    relations: ['author'],
                });

                const createReq: CreateVideoRequestRequest = {
                    videoId: video.id,
                    type: VideoRequestTypeEnum.UPDATE,
                    quality: video.quality === VideoQualityEnum.WEB ? VideoQualityEnum.DVD : VideoQualityEnum.WEB,
                };

                const res = await env.shikiAuthClient.createVideoRequests(createReq);

                // act
                const videoRequest = await approveRequest(res.id);
                const newVideo = await videoRepo.findOne({
                    where: { id: video.id },
                    relations: ['author'],
                });

                expect(newVideo.quality).toBe(videoRequest.quality);
                expect(newVideo.episode).toBe(video.episode);
                expect(newVideo.kind).toBe(video.kind);
                expect(newVideo.language).toBe(video.language);
                expect(newVideo.author).toStrictEqual(video.author);
            },
        );

        it('Should return 200 and update video language',
            async () => {
                // arrange
                const videoRepo = env.dataSource.getRepository(VideoEntity);
                const video = await videoRepo.findOne({
                    where: { animeId: 1 },
                    relations: ['author'],
                });

                const createReq: CreateVideoRequestRequest = {
                    videoId: video.id,
                    type: VideoRequestTypeEnum.UPDATE,
                    language: video.language === 'RU' ? 'EN' : 'RU',
                };

                const res = await env.shikiAuthClient.createVideoRequests(createReq);

                // act
                const videoRequest = await approveRequest(res.id);
                const newVideo = await videoRepo.findOne({
                    where: { id: video.id },
                    relations: ['author'],
                });

                expect(newVideo.language).toBe(videoRequest.language);
                expect(newVideo.episode).toBe(video.episode);
                expect(newVideo.kind).toBe(video.kind);
                expect(newVideo.quality).toBe(video.quality);
                expect(newVideo.author).toStrictEqual(video.author);
            },
        );

        it('Should return 200 and update video author',
            async () => {
                // arrange
                const videoRepo = env.dataSource.getRepository(VideoEntity);
                const video = await videoRepo.findOne({
                    where: { animeId: 1 },
                    relations: ['author'],
                });

                const createReq: CreateVideoRequestRequest = {
                    videoId: video.id,
                    type: VideoRequestTypeEnum.UPDATE,
                    author: video.author.name + '_updated',
                };

                const res = await env.shikiAuthClient.createVideoRequests(createReq);

                // act
                const videoRequest = await approveRequest(res.id);
                const newVideo = await videoRepo.findOne({
                    where: { id: video.id },
                    relations: ['author'],
                });

                expect(newVideo.author).toStrictEqual(videoRequest.author);
                expect(newVideo.episode).toBe(video.episode);
                expect(newVideo.kind).toBe(video.kind);
                expect(newVideo.quality).toBe(video.quality);
                expect(newVideo.language).toBe(video.language);
            },
        );
    });

    describe('PATCH /api/admin/requests/videos/approve validation test cases', () => {
        const validationTestCases = [
            { req: { id: -1, comment: 'any'.padEnd(15, '!') }, name: 'id is greater or equals to 0' },
            { req: { id: 0, comment: 'long'.padEnd(1002, '!') }, name: 'comment to long' },
        ];

        for (const [index, { req, name }] of validationTestCases.entries()) {
            it(
                `should return 400 Bad Request #${index} ${name}`,
                async () => {
                    return env.adminClient.approveVideoRequestRaw(req).expect(400);
                },
            );
        }
    });
});
