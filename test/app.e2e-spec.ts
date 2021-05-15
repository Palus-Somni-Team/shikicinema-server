import * as passport from 'passport';
import * as request from 'supertest';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { SessionEntity, UserEntity, VideoEntity } from '@app-entities';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormStore } from 'connect-typeorm';
import { getConnection, getRepository } from 'typeorm';

import { AppModule } from '../src/app.module';

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
                const user1 = await getConnection().getRepository(UserEntity).findOne({ where: { login: 'user1' } });

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
                const user1 = await getConnection().getRepository(UserEntity).findOne({ where: { login: 'user1' } });
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
                const user1 = await getConnection().getRepository(UserEntity).findOne({ where: { login: 'user1' } });
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

    describe('/API', () => {
        describe('/VIDEO', () => {
            it(
                'should return video in correct format GET /api/video',
                async () => {
                    const animeId = 1;
                    const episode = 1;
                    const video = await getConnection().getRepository(VideoEntity).findOne({
                        where: { animeId, episode },
                        relations: ['uploader'],
                    });

                    return request(app.getHttpServer())
                        .get(`/api/video?animeId=${animeId}&episode=${episode}`)
                        .expect(200)
                        .expect([
                            {
                                id: video.id,
                                animeId: video.animeId,
                                episode: video.episode,
                                url: video.url,
                                kind: video.kind,
                                language: video.language,
                                quality: video.quality,
                                author: video.author,
                                uploader: {
                                    id: video.uploader.id,
                                    shikimoriId: video.uploader.shikimoriId,
                                    banned: video.uploader.banned,
                                },
                                watchesCount: video.watchesCount,
                                createdAt: video.createdAt.toISOString(),
                                updatedAt: video.updatedAt.toISOString(),
                            },
                        ]);
                },
            );

            it(
                'should return all videos by animeId GET /api/video',
                async () => {
                    const animeId = 1;
                    const videos = await getConnection().getRepository(VideoEntity).find({
                        where: { animeId },
                        relations: ['uploader'],
                    });

                    return request(app.getHttpServer())
                        .get(`/api/video?animeId=${animeId}`)
                        .expect(200)
                        .expect((res) => res.body.length === videos.length);
                },
            );
        });
    });
});
