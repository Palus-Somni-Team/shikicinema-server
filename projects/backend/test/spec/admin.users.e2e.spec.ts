import { TestAdminEnvironment } from '~backend-e2e/test.admin.environment';

describe('Admin Users (e2e)', () => {
    const user1LoginData = { login: 'user1', password: '12345678' };

    const env = new TestAdminEnvironment();
    env.init();

    it(
        'should not allow to access admin route without proper rights GET /api/admin/user',
        async () => {
            await env.anonClient.login(user1LoginData);

            return env.anonClient.getUsersRaw()
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
        async () => env.adminClient.getUsers(),
    );
});
