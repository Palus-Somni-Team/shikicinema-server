import { TestEnvironment } from '~backend-e2e/test.environment';
import { UserEntity } from '~backend/entities';

describe('Auth (e2e)', () => {
    const user1LoginData = { login: 'user1', password: '12345678' };

    const env = new TestEnvironment();
    env.init();

    it(
        'should return 401 for unauthorized GET /auth/me',
        async () => {
            const unauthorizedMeRes = await env.anonClient.meRaw();

            expect(unauthorizedMeRes.status).toBe(401);
            expect(unauthorizedMeRes.body).toStrictEqual({
                message: 'Unauthorized',
                statusCode: 401,
            });
        },
    );

    it(
        'should return 401 for unknown credentials POST /auth/login',
        async () => {
            const loginRes = await env.anonClient.loginRaw({
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
            const user1 = await env.dataSource
                .getRepository(UserEntity)
                .findOne({ where: { login: user1LoginData.login } });
            const loginRes = await env.anonClient.loginRaw(user1LoginData);
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
            const user1 = await env.dataSource
                .getRepository(UserEntity)
                .findOne({ where: { login: user1LoginData.login } });

            await env.anonClient.login(user1LoginData);
            const meRes = await env.anonClient.meRaw();

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
            await env.anonClient.login(user1LoginData);
            const logoutRes = await env.anonClient.logout();

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

            const registerRes = await env.anonClient.registerRaw({ login, password, email });
            const loginRes = await env.anonClient.loginRaw({ login, password });
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
