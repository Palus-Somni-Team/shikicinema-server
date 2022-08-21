import { TestClient } from '@e2e/test.client';
import { TestEnvironment } from '@e2e/test.environment';

export class TestAdminEnvironment extends TestEnvironment {
    private _adminClient: TestClient;

    get AdminClient(): TestClient {
        return this._adminClient;
    }

    init() {
        super.init();

        beforeEach(async () => {
            this._adminClient = new TestClient(this.App.getHttpServer());
            await this._adminClient.login(TestEnvironment.AdminLoginData);
        });
    }
}
