import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { CreateVideoRequest, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormStore } from 'connect-typeorm';

import { AppModule } from '@app/app.module';
import {
    SessionEntity,
    UserEntity,
    VideoEntity,
} from '@app-entities';
import { TestClient } from '@e2e/test.client';
import { UpdateVideoRequest } from '@app-routes/api/admin/video/dto';

describe('AppController (e2e)', () => {
    const user1LoginData = { login: 'user1', password: '12345678' };
    const adminLoginData = { login: 'admin', password: '12345678' };

    let app: INestApplication;
    let dataSource: DataSource;
    let anonClient: TestClient;
    let adminClient: TestClient;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();


        app = moduleFixture.createNestApplication();
        dataSource = app.get(DataSource);
        await dataSource.runMigrations({ transaction: 'all' });
        const configService = app.get(ConfigService);
        const sessionsConfig = configService.get('express-session');
        const sessionStorage = new TypeormStore({ cleanupLimit: 2 });
        const sessionStore = sessionStorage.connect(dataSource.getRepository(SessionEntity));

        app.use(session({ store: sessionStore, ...sessionsConfig }));
        app.use(passport.initialize());
        app.use(passport.session());
        await app.init();
    });

    beforeEach(() => {
        anonClient = new TestClient(app.getHttpServer());
    });

    afterAll(() => app.close());

    describe('/AUTH', () => {
        it(
            'should return 403 for unauthorized GET /auth/me',
            async () => {
                const unauthorizedMeRes = await anonClient.meRaw();

                expect(unauthorizedMeRes.status).toBe(403);
                expect(unauthorizedMeRes.body).toStrictEqual({
                    error: 'Forbidden',
                    message: 'Forbidden resource',
                    statusCode: 403,
                });
            },
        );

        it(
            'should return 401 for unknown credentials POST /auth/login',
            async () => {
                const loginRes = await anonClient.loginRaw({
                    login: 'unknown',
                    password: '1234567890',
                });

                expect(loginRes.status).toBe(401);
                expect(loginRes.body).toStrictEqual({
                    statusCode: 401,
                    message: 'Unauthorized',
                });
            },
        );

        it(
            'should return 200 for correct credentials POST /auth/login',
            async () => {
                const user1 = await dataSource
                    .getRepository(UserEntity)
                    .findOne({ where: { login: user1LoginData.login } });
                const loginRes = await anonClient.loginRaw(user1LoginData);
                const setCookieHeader = loginRes.headers['set-cookie'];
                const setCookieRegex = /sid=(.*); Path=\/; Expires=(.*); HttpOnly; SameSite=Lax/;

                expect(setCookieHeader).toEqual([
                    expect.stringMatching(setCookieRegex),
                ]);
                expect(loginRes.body).toStrictEqual({
                    id: user1.id,
                    login: user1.login,
                    name: user1.name,
                    email: user1.email,
                    roles: ['user'],
                    createdAt: user1.createdAt.toISOString(),
                    updatedAt: user1.updatedAt.toISOString(),
                });
            },
        );

        it(
            'should return user\'s info for logged in user GET /auth/me',
            async () => {
                const user1 = await dataSource
                    .getRepository(UserEntity)
                    .findOne({ where: { login: user1LoginData.login } });

                await anonClient.login(user1LoginData);
                const meRes = await anonClient.meRaw();

                expect(meRes.body).toStrictEqual({
                    id: user1.id,
                    login: user1.login,
                    name: user1.name,
                    email: user1.email,
                    roles: ['user'],
                    createdAt: user1.createdAt.toISOString(),
                    updatedAt: user1.updatedAt.toISOString(),
                });
            },
        );

        it(
            'should return 200 for logged in user on logout POST /auth/logout',
            async () => {
                await anonClient.login(user1LoginData);
                const logoutRes = await anonClient.logout();

                expect(logoutRes.status).toBe(200);
                expect(logoutRes.body).toStrictEqual({});
            },
        );

        it(
            'should return newly registered user POST /auth/register',
            async () => {
                const { login, password, email } = {
                    login: 'new_user',
                    password: '12345678',
                    email: 'new_user@email.com',
                };

                const registerRes = await anonClient.registerRaw({ login, password, email });
                const loginRes = await anonClient.loginRaw({ login, password });
                const setCookieHeader = loginRes.headers['set-cookie'];
                const setCookieRegex = /sid=(.*); Path=\/; Expires=(.*); HttpOnly; SameSite=Lax/;

                expect(registerRes.status).toBe(201);
                expect(loginRes.status).toBe(200);
                expect(loginRes.body).toEqual(registerRes.body);
                expect(setCookieHeader).toEqual([
                    expect.stringMatching(setCookieRegex),
                ]);
            },
        );
    });

    describe('/ADMIN', () => {
        describe('/USERS', () => {
            it(
                'should not allow to access admin route without proper rights GET /api/admin/users',
                async () => {
                    await anonClient.login(user1LoginData);

                    return anonClient.getUsersRaw()
                        .expect(403)
                        .expect({
                            statusCode: 403,
                            message: 'Forbidden resource',
                            error: 'Forbidden',
                        });
                },
            );

            it(
                'should allow to access admin route for admin GET /api/admin/users',
                async () => {
                    adminClient = new TestClient(app.getHttpServer());
                    await adminClient.login(adminLoginData);
                    return adminClient.getUsers();
                },
            );
        });

        describe('/VIDEOS', () => {
            const animeId = 21;
            const episode = 113;
            const positivePatchReqBodies: UpdateVideoRequest[] = [
                {},
                { animeId },
                { episode },
                { animeId, episode, author: 'jfhbdfgjbfdgdfgkjdf' },
                { animeId, episode, author: null },
                { animeId, episode, url: 'https://kekeke.lel' },
                { animeId, episode, url: 'http://lelelele.kek' },
                { animeId, episode, kind: VideoKindEnum.DUBBING },
                { animeId, episode, kind: VideoKindEnum.SUBTITLES },
                { animeId, episode, kind: VideoKindEnum.ORIGINAL },
                { animeId, episode, language: 'us' },
                { animeId, episode, language: null },
                { animeId, episode, language: 'ru' },
                { animeId, episode, quality: VideoQualityEnum.BD },
                { animeId, episode, quality: VideoQualityEnum.TV },
                { animeId, episode, quality: VideoQualityEnum.DVD },
                { animeId, episode, quality: VideoQualityEnum.WEB },
                { animeId, episode, quality: VideoQualityEnum.UNKNOWN },
                { animeId, episode, watchesCount: 0 },
                { animeId, episode, watchesCount: 0xDEADBEEF },
            ];
            const negativePatchReqBodies: Partial<UpdateVideoRequest>[] = [
                { animeId, episode: null },
                { animeId: null, episode: null },
                { animeId: -1, episode: -4 },
                { animeId: 3, episode: -1 },
                { animeId: -3, episode: 2 },
                { animeId: 3, episode: NaN },
                { animeId: NaN, episode: 5 },
                { animeId: NaN, episode: NaN },
                { animeId: 3, episode: Infinity },
                { animeId: Infinity, episode: 5 },
                { animeId: Infinity, episode: Infinity },
                { animeId, episode, watchesCount: null },
                { animeId, episode, watchesCount: -5 },
                { animeId, episode, watchesCount: NaN },
                { animeId, episode, watchesCount: Infinity },
                { animeId, episode, url: null },
                { animeId, episode, kind: null },
            ];

            beforeEach(async () => {
                adminClient = new TestClient(app.getHttpServer());
                await adminClient.login(adminLoginData);
            });

            for (const [index, patchReqBody] of negativePatchReqBodies.entries()) {
                const patchReqAsText = JSON.stringify(patchReqBody);

                it(
                    `should return 400 Bad Request #${index} ${patchReqAsText} PATCH /api/admin/videos/:videoId`,
                    async () => {
                        const video = await dataSource
                            .getRepository(VideoEntity)
                            .findOne({
                                where: { animeId, episode },
                                relations: ['uploader'],
                            });

                        return adminClient.updateVideoRaw(video.id, patchReqBody).expect(400);
                    },
                );
            }

            for (const [index, patchReqBody] of positivePatchReqBodies.entries()) {
                const patchReqAsText = JSON.stringify(patchReqBody);

                it(
                    `should return 200 OK & update video #${index} ${patchReqAsText} PATCH /api/admin/videos/:videoId`,
                    async () => {
                        const video = await dataSource
                            .getRepository(VideoEntity)
                            .findOne({
                                where: { animeId, episode },
                                relations: ['uploader'],
                            });

                        const res = await adminClient.updateVideo(video.id, patchReqBody);
                        expect(res).toEqual(expect.objectContaining({
                            id: video.id,
                            animeId: patchReqBody.animeId ?? video.animeId,
                            author: patchReqBody.author ?? video.author,
                            episode: patchReqBody.episode ?? video.episode,
                            kind: patchReqBody.kind ?? video.kind,
                            language: patchReqBody.language ?? video.language,
                            quality: patchReqBody.quality ?? video.quality,
                            uploader: {
                                shikimoriId: video.uploader.shikimoriId,
                                banned: video.uploader.banned,
                                id: video.uploader.id,
                            },
                            url: patchReqBody.url ?? video.url,
                            watchesCount: patchReqBody.watchesCount ?? video.watchesCount,
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }));
                    },
                );
            }

            it(
                'should return 404 Not Found PATCH /api/admin/videos/:videoId',
                async () => {
                    return adminClient.updateVideoRaw(0xDEAD_BEEF, {}).expect(404);
                },
            );

            it(
                'should return 404 Not Found GET /api/admin/videos/:videoId',
                async () => {
                    return adminClient.getVideosRaw(0xDEAD_BEEF).expect(404);
                },
            );

            it(
                'should find video and return in format GET /api/admin/videos/:videoId',
                async () => {
                    const video = await dataSource
                        .getRepository(VideoEntity)
                        .findOne({
                            where: { animeId: 21, episode: 113 },
                            relations: ['uploader'],
                        });

                    const res = await adminClient.getVideos(video.id);
                    expect(res).toStrictEqual({
                        animeId: video.animeId,
                        episode: video.episode,
                        url: video.url,
                        kind: video.kind,
                        language: video.language,
                        quality: video.quality,
                        author: video.author,
                        uploader: {
                            shikimoriId: video.uploader.shikimoriId,
                            banned: video.uploader.banned,
                            id: video.uploader.id,
                        },
                        watchesCount: video.watchesCount,
                        id: video.id,
                        createdAt: video.createdAt.toISOString(),
                        updatedAt: video.updatedAt.toISOString(),
                    });
                },
            );

            it(
                'should delete video DELETE /api/admin/videos/:videoId',
                async () => {
                    const video = await dataSource
                        .getRepository(VideoEntity)
                        .findOneBy({ animeId: 21, episode: 113 });

                    return adminClient.deleteVideos(video.id);
                },
            );
        });
    });

    describe('/API', () => {
        let shikiAuthClient: TestClient;

        beforeEach(() => {
            const authHeader = new Map<string, string>();
            authHeader.set('Authorization', 'Bearer user1-test-upload-token');
            shikiAuthClient = new TestClient(app.getHttpServer(), authHeader);
        });

        describe('/VIDEOS', () => {
            it(
                'should return video in correct format GET /api/videos',
                async () => {
                    const animeId = 1;
                    const episode = 1;

                    const res = await anonClient.getVideosByEpisode({ animeId, episode });
                    for (const video of res) {
                        expect(video).toEqual(expect.objectContaining({
                            animeId, episode,
                            id: expect.any(Number),
                            author: expect.any(String),
                            url: expect.any(String),
                            kind: expect.any(Number),
                            quality: expect.any(Number),
                            language: expect.any(String),
                            watchesCount: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                            uploader: expect.objectContaining({
                                id: expect.any(Number),
                                banned: expect.any(Boolean),
                                shikimoriId: expect.any(String),
                            }),
                        }));
                    }
                },
            );

            it(
                'should return all videos by animeId GET /api/videos',
                async () => {
                    const animeId = 1;
                    const episode = 3;
                    const videos = await dataSource
                        .getRepository(VideoEntity)
                        .find({ where: { animeId, episode } });

                    const res = await anonClient.getVideosByEpisode({ animeId, episode });
                    expect(res.length === videos.length);
                },
            );

            it(
                'should return correct info by animeId GET /api/videos/info',
                async () => {
                    const animeId = 1;

                    const res = await anonClient.getVideosInfo({ animeId });
                    expect(res).toStrictEqual({
                        1: { kinds: [VideoKindEnum.DUBBING], domains: ['admin1.up'] },
                        2: { kinds: [VideoKindEnum.DUBBING], domains: ['admin2.up'] },
                        3: { kinds: [VideoKindEnum.DUBBING], domains: ['admin3.up'] },
                    });
                },
            );

            it(
                'should return 200 OK and empty body if cannot found anime with this id GET /api/videos/info',
                async () => {
                    const animeId = 404;

                    const res = await anonClient.getVideosInfo({ animeId });
                    expect(res).toStrictEqual({});
                },
            );

            it(
                'should return 201 & create video POST /api/videos',
                async () => {
                    const animeId = 12345000;
                    const episode = 5;
                    const reqBody: CreateVideoRequest = {
                        animeId,
                        episode,
                        language: 'ru',
                        author: 'some author',
                        kind: VideoKindEnum.ORIGINAL,
                        quality: VideoQualityEnum.WEB,
                        url: 'https://test.com/upload_video.mp4',
                    };
                    const createVideoRes = await shikiAuthClient.createVideo(reqBody);
                    const video = await dataSource
                        .getRepository(VideoEntity)
                        .findOneBy({ animeId, episode });

                    expect(createVideoRes).toEqual(
                        expect.objectContaining({
                            animeId: video.animeId,
                            episode: video.episode,
                            language: video.language,
                            author: video.author,
                            kind: +video.kind,
                            quality: +video.quality,
                            url: video.url,
                            id: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                            watchesCount: 0,
                            uploader: expect.objectContaining({
                                id: expect.any(Number),
                                banned: expect.any(Boolean),
                                shikimoriId: expect.any(String),
                            }),
                        })
                    );
                },
            );

            it(
                'should return 409 Already exists POST /api/videos',
                async () => {
                    const animeId = 21;
                    const episode = 113;
                    const reqBody: CreateVideoRequest = {
                        animeId,
                        episode,
                        language: 'ru',
                        author: 'some author',
                        kind: VideoKindEnum.ORIGINAL,
                        quality: VideoQualityEnum.WEB,
                        url: 'https://test.com/upload_video.mp4',
                    };
                    const createVideoRes = await shikiAuthClient.createVideoRaw(reqBody);

                    expect(createVideoRes.status).toBe(409);
                },
            );

            it(
                'should return 200 OK PATCH /api/videos/:videoId/watch',
                async () => {
                    const animeId = 1;
                    const episode = 1;
                    const video = await dataSource
                        .getRepository(VideoEntity)
                        .findOneBy({ animeId, episode });

                    return anonClient.watchVideoRaw(video.id).expect({});
                },
            );

            it(
                'should return 404 Not Found for non-existing video PATCH /api/videos/:videoId/watch',
                async () => {
                    const videoId = 404;
                    return anonClient.watchVideoRaw(videoId).expect(404);
                },
            );

            it(
                'should return 200 OK GET /api/videos/search',
                async () => {
                    const shikimoriId = '13371337';
                    const videos = await dataSource
                        .getRepository(VideoEntity)
                        .find({
                            where: { uploader: { shikimoriId } },
                        });

                    const res = await anonClient.searchVideo({ uploader: shikimoriId });
                    expect(res.length === videos.length);
                },
            );

            it(
                'should return 200 OK & empty array GET /api/videos/search',
                async () => {
                    const shikimoriId = '404404404';
                    const res = await anonClient.searchVideo({ uploader: shikimoriId });
                    expect(res).toStrictEqual([]);
                },
            );
        });
    });
});
