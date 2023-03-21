import { TestClient } from '~backend-root/test/test.client';
import { TestEnvironment } from '~backend-root/test/test.environment';

export class TestAdminEnvironment extends TestEnvironment {
    private _adminClient: TestClient;

    get adminClient(): TestClient {
        return this._adminClient;
    }

    init() {
        super.init();

        beforeEach(async () => {
            this._adminClient = new TestClient(this.app.getHttpServer());
            await this._adminClient.login(TestEnvironment.AdminLoginData);
        });
    }
}
