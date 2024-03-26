import {
    CreateVideoRequestRequest,
    GetVideoRequestsResponse,
    VideoRequest,
} from '~backend/routes/api/requests/video/dto';
import { In } from 'typeorm';
import { TestEnvironment } from '~backend-e2e/test.environment';
import { UploaderEntity, UserEntity, VideoEntity, VideoRequestEntity } from '~backend/entities';
import { VideoKindEnum, VideoQualityEnum, VideoRequestStatusEnum, VideoRequestTypeEnum } from '@shikicinema/types';

describe('Video Requests API (e2e)', () => {
    const env = new TestEnvironment();
    env.init();

    describe('GET /api/requests/videos with filters should return 200 & correct data', () => {
        const testCases = {
            'filter by id': undefined,
            'filter by types': undefined,
            'filter by statuses': undefined,
            'filter by creator (user1)': undefined,
            'filter by creator (admin)': undefined,
            'filter by reviewer': undefined,
            'empty filter': undefined,
        };

        beforeAll(async () => {
            const userRepo = env.dataSource.getRepository(UserEntity);
            const uploaderRepo = env.dataSource.getRepository(UploaderEntity);
            const reviewer = await userRepo.findOneBy({ login: 'admin' });
            const user1Uploader = await uploaderRepo.findOneBy({
                shikimoriId: TestEnvironment.User1ShikimoriData.shikimoriId,
            });
            const adminUploader = await uploaderRepo.findOneBy({
                shikimoriId: TestEnvironment.AdminShikimoriData.shikimoriId,
            });

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

            testCases['filter by creator (user1)'] = {
                req: { createdBy: user1Uploader.id },
                where: { createdBy: { id: user1Uploader.id } },
            };

            testCases['filter by creator (admin)'] = {
                req: { createdBy: adminUploader.id },
                where: { createdBy: { id: adminUploader.id } },
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
                        new GetVideoRequestsResponse(data.map((_) => new VideoRequest(_)), 20, 0, total),
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

    describe('POST /api/requests/videos', () => {
        it('User must be authorized',
            async () => {
                const res = await env.anonClient.createVideoRequestsRaw(new CreateVideoRequestRequest());

                expect(res.status).toBe(401);
            },
        );

        it('Should return 200 & correct data',
            async () => {
                const video = await env.dataSource.getRepository(VideoEntity).findOne({ where: { animeId: 1 } });
                const req: CreateVideoRequestRequest = {
                    videoId: video.id,
                    type: VideoRequestTypeEnum.UPDATE,
                    episode: video.episode + 1,
                    kind: video.kind === VideoKindEnum.SUBTITLES ? VideoKindEnum.DUBBING : VideoKindEnum.SUBTITLES,
                    quality: video.quality === VideoQualityEnum.DVD ? VideoQualityEnum.WEB : VideoQualityEnum.DVD,
                    language: video.language === 'RU' ? 'EN' : 'RU',
                    author: 'UPDATED',
                    comment: 'test comment',
                };
                const res = await env.shikiAuthClient.createVideoRequests(req);

                const videoRequest = await env.dataSource.getRepository(VideoRequestEntity).findOne({
                    where: {
                        video: { id: video.id },
                        type: req.type,
                        episode: req.episode,
                        kind: req.kind,
                        quality: req.quality,
                        language: req.language,
                        author: { name: req.author },
                        comment: req.comment,
                        createdBy: { shikimoriId: TestEnvironment.User1ShikimoriData.shikimoriId },
                    },
                    relations: ['createdBy', 'author', 'video'],
                });

                expect(videoRequest).not.toBeNull();
                expect(res).toStrictEqual(new VideoRequest(videoRequest));
            },
        );
    });

    describe('POST /api/requests/videos validation test cases', () => {
        const validationTestCases = [
            { req: { videoId: 1 }, name: 'Request type is not specified' },
            { req: { type: VideoRequestTypeEnum.UPDATE }, name: 'videoId is not specified' },
            { req: { videoId: -1, type: VideoRequestTypeEnum.UPDATE }, name: 'videoId is less than 0' },
            { req: { videoId: 1, type: 'invalid' }, name: 'Request type is invalid' },
            { req: { videoId: 1, type: VideoRequestTypeEnum.UPDATE, episode: 0 }, name: 'episode is less than 1' },
            { req: { videoId: 1, type: VideoRequestTypeEnum.UPDATE, episode: 1.5 }, name: 'episode must be int' },
            { req: { videoId: 1, type: VideoRequestTypeEnum.UPDATE, kind: 'invalid' }, name: 'kind is invalid' },
            { req: { videoId: 1, type: VideoRequestTypeEnum.UPDATE, quality: 'invalid' }, name: 'quality is invalid' },
            { req: { videoId: 1, type: VideoRequestTypeEnum.UPDATE, language: 'long' }, name: 'language is invalid' },
            {
                req: { videoId: 1, type: VideoRequestTypeEnum.UPDATE, author: 'long'.padEnd(257, '!') },
                name: 'author is too long',
            },
            {
                req: { videoId: 1, type: VideoRequestTypeEnum.UPDATE, comment: 'long'.padEnd(1001, '!') },
                name: 'comment is too long',
            },
        ];

        for (const [index, { req, name }] of validationTestCases.entries()) {
            it(
                `should return 400 Bad Request #${index} ${name}`,
                async () => {
                    const r = req as CreateVideoRequestRequest;
                    return env.shikiAuthClient.createVideoRequestsRaw(r).expect(400);
                },
            );
        }
    });
});
