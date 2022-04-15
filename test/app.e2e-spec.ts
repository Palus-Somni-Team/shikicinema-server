import * as passport from 'passport';
import * as request from 'supertest';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { SessionEntity, UserEntity, VideoEntity } from '@app-entities';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormStore } from 'connect-typeorm';
import { VideoKindEnum } from '@lib-shikicinema';
import { getConnection, getRepository } from 'typeorm';

import { AppModule } from '@app/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();


        app = moduleFixture.createNestApplication();
        await getConnection().runMigrations({ transaction: 'all' });
        const configService = app.get(ConfigService);
        const sessionsConfig = configService.get('express-session');
        const sessionStorage = new TypeormStore({ cleanupLimit: 2 });
        const sessionStore = sessionStorage.connect(getRepository(SessionEntity));

        app.use(session({ store: sessionStore, ...sessionsConfig }));
        app.use(passport.initialize());
        app.use(passport.session());
        await app.init();
    });

    afterAll(() => app.close());

    describe('/AUTH', () => {
        it(
            'should return 403 for unauthorized GET /auth/me',
            () => request(app.getHttpServer())
                .get('/auth/me')
                .expect(403)
                .expect({
                    error: 'Forbidden',
                    message: 'Forbidden resource',
                    statusCode: 403,
                }),
        );

        it(
            'should return 401 for unknown credentials POST /auth/login',
            () => request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    login: 'unknown',
                    password: '1234567890',
                })
                .expect(401)
                .expect({
                    statusCode: 401,
                    message: 'Unauthorized',
                }),
        );

        it(
            'should return 200 for correct credentials POST /auth/login',
            async () => {
                const user1 = await getConnection()
                    .getRepository(UserEntity)
                    .findOne({ where: { login: 'user1' } });

                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({ login: user1.login, password: '12345678' })
                    .expect(200)
                    .expect('Set-Cookie', /sid=(.*); Path=\/; Expires=(.*); HttpOnly; SameSite=Lax/)
                    .expect({
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
                const user1 = await getConnection()
                    .getRepository(UserEntity)
                    .findOne({ where: { login: 'user1' } });
                const loginRes = await request(app.getHttpServer())
                    .post('/auth/login')
                    .send({ login: user1.login, password: '12345678' });
                const meRes = await request(app.getHttpServer())
                    .get('/auth/me')
                    .set('Cookie', loginRes.get('Set-Cookie'))
                    .send();

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
                const user1 = await getConnection()
                    .getRepository(UserEntity)
                    .findOne({ where: { login: 'user1' } });
                const loginRes = await request(app.getHttpServer())
                    .post('/auth/login')
                    .send({ login: user1.login, password: '12345678' });

                return request(app.getHttpServer())
                    .post('/auth/logout')
                    .set('Cookie', loginRes.get('Set-Cookie'))
                    .expect(200)
                    .expect({});
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
                const loginRes = await request(app.getHttpServer())
                    .post('/auth/register')
                    .send({ login, password, email });

                return request(app.getHttpServer())
                    .post('/auth/login')
                    .send({ login, password })
                    .expect(200)
                    .expect('Set-Cookie', /sid=(.*); Path=\/; Expires=(.*); HttpOnly; SameSite=Lax/)
                    .expect(loginRes.body);
            },
        );
    });

    describe('/ADMIN', () => {
        describe('/USER', () => {
            it(
                'should not allow to access admin route without proper rights GET /api/admin/user',
                async () => {
                    const loginRes = await request(app.getHttpServer())
                        .post('/auth/login')
                        .send({ login: 'user1', password: '12345678' });

                    return request(app.getHttpServer())
                        .get('/api/admin/user')
                        .set('Cookie', loginRes.get('Set-Cookie'))
                        .expect(403)
                        .expect({
                            statusCode: 403,
                            message: 'Forbidden resource',
                            error: 'Forbidden',
                        });
                },
            );

            it(
                'should allow to access admin route for admin GET /api/admin/user',
                async () => {
                    const loginRes = await request(app.getHttpServer())
                        .post('/auth/login')
                        .send({ login: 'admin', password: '12345678' });

                    return request(app.getHttpServer())
                        .get('/api/admin/user')
                        .set('Cookie', loginRes.get('Set-Cookie'))
                        .expect(200);
                },
            );
        });

        describe('/VIDEOS', () => {
            it(
                'should delete video DELETE /api/admin/videos/:videoId',
                async () => {
                    const loginRes = await request(app.getHttpServer())
                        .post('/auth/login')
                        .send({ login: 'admin', password: '12345678' });
                    const video = await getConnection()
                        .getRepository(VideoEntity)
                        .findOne({ animeId: 21, episode: 113 });

                    return request(app.getHttpServer())
                        .delete(`/api/admin/videos/${video.id}`)
                        .set('Cookie', loginRes.get('Set-Cookie'))
                        .expect(200);
                },
            );
        });
    });

    describe('/API', () => {
        describe('/VIDEOS', () => {
            it(
                'should return video in correct format GET /api/videos',
                async () => {
                    const animeId = 1;
                    const episode = 1;

                    return request(app.getHttpServer())
                        .get(`/api/videos?animeId=${animeId}&episode=${episode}`)
                        .expect(200)
                        .expect((res) => {
                            for (const video of res.body) {
                                expect(video).toEqual(expect.objectContaining({
                                    animeId, episode,
                                    id: expect.any(Number),
                                    author: expect.any(String),
                                    url: expect.any(String),
                                    kind: expect.any(String),
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
                        });
                },
            );

            it(
                'should return all videos by animeId GET /api/videos',
                async () => {
                    const animeId = 1;
                    const videos = await getConnection()
                        .getRepository(VideoEntity)
                        .find({
                            where: { animeId },
                            relations: ['uploader'],
                        });

                    return request(app.getHttpServer())
                        .get(`/api/videos?animeId=${animeId}`)
                        .expect(200)
                        .expect((res) => res.body.length === videos.length);
                },
            );

            it(
                'should return correct info by animeId GET /api/videos/:animeId/info',
                async () => {
                    const animeId = 1;

                    return request(app.getHttpServer())
                        .get(`/api/videos/${animeId}/info`)
                        .expect(200)
                        .expect({
                            1: { kinds: [VideoKindEnum.DUBBING], domains: ['admin1.up'] },
                            2: { kinds: [VideoKindEnum.DUBBING], domains: ['admin2.up'] },
                            3: { kinds: [VideoKindEnum.DUBBING], domains: ['admin3.up'] },
                        });
                },
            );

            it(
                'should return 404 Not Found if cannot found anime with this id GET /api/videos/:animeId/info',
                async () => {
                    const animeId = 404;

                    return request(app.getHttpServer())
                        .get(`/api/videos/${animeId}/info`)
                        .expect(404);
                },
            );
        });
    });
});
