import { TestEnvironment } from '@e2e/test.environment';

describe('OAuth endpoints (e2e)', () => {
    const user1LoginData = { login: 'user1', password: '12345678' };
    const bannedUserLoginData = { login: 'banned', password: '12345678' };

    const env = new TestEnvironment();
    env.init();

    /* OAuth providers that should be tested */
    const providers = ['shikimori'];

    for (const provider of providers) {
        it(
            `should return 401 for unauthorized GET /oauth/${provider}`,
            async () => {
                const unauthorizedAccessTokenRes = await env.anonClient.getAccessToken(provider);

                expect(unauthorizedAccessTokenRes.status).toBe(401);
                expect(unauthorizedAccessTokenRes.body).toStrictEqual({
                    message: 'Unauthorized',
                    statusCode: 401,
                });
            },
        );

        it(
            `should disallow redirect for banned users /oauth/${provider}`,
            async () => {
                await env.anonClient.loginRaw(bannedUserLoginData);
                const bannedAccessTokenRes = await env.anonClient.getAccessToken(provider);

                expect(bannedAccessTokenRes.status).toBe(403);
                expect(bannedAccessTokenRes.body).toStrictEqual({
                    error: 'Forbidden',
                    message: 'Forbidden resource',
                    statusCode: 403,
                });
            },
        );

        it(
            `should redirect to provider's oauth endpoint /oauth/${provider}`,
            async () => {
                await env.anonClient.loginRaw(user1LoginData);
                const unauthorizedAccessTokenRes = await env.anonClient.getAccessToken(provider);

                expect(unauthorizedAccessTokenRes.status).toBe(302);
            },
        );
    }
});
