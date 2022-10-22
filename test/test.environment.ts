import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { initSession, initSwagger } from '@app-utils/bootstrap.utils';

import { AppModule } from '@app/app.module';
import { TestClient } from '@e2e/test.client';

export class TestEnvironment {
    public static readonly AdminLoginData = { login: 'admin', password: '12345678' };

    private _dataSource: DataSource;
    private _anonClient: TestClient;
    private _shikiAuthClient: TestClient;

    protected app: INestApplication;

    get dataSource(): DataSource {
        return this._dataSource;
    }

    get anonClient(): TestClient {
        return this._anonClient;
    }

    get shikiAuthClient(): TestClient {
        return this._shikiAuthClient;
    }

    public init() {
        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [AppModule],
            }).compile();

            this.app = moduleFixture.createNestApplication();
            this._dataSource = this.app.get(DataSource);
            await this._dataSource.runMigrations({ transaction: 'all' });
            const configService = this.app.get(ConfigService);

            initSession(this.app, this.dataSource, configService);
            initSwagger(this.app);

            await this.app.init();
        });

        afterAll(() => this.app.close());

        beforeEach(() => {
            this._anonClient = new TestClient(this.app.getHttpServer());

            const authHeader = new Map<string, string>();
            authHeader.set('Authorization', 'Bearer user1-test-upload-token');
            this._shikiAuthClient = new TestClient(this.app.getHttpServer(), authHeader);
        });
    }
}
