import * as passport from 'passport';
import * as session from 'express-session';
import { AppModule } from '@app/app.module';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { SessionEntity } from '@app-entities';
import { Test, TestingModule } from '@nestjs/testing';
import { TestClient } from '@e2e/test.client';
import { TypeormStore } from 'connect-typeorm';

export class TestEnvironment {
    public static readonly AdminLoginData = { login: 'admin', password: '12345678' };

    private _dataSource: DataSource;
    private _anonClient: TestClient;
    private _shikiAuthClient: TestClient;

    protected App: INestApplication;

    get DataSource(): DataSource {
        return this._dataSource;
    }

    get AnonClient(): TestClient {
        return this._anonClient;
    }

    get ShikiAuthClient(): TestClient {
        return this._shikiAuthClient;
    }

    public init() {
        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [AppModule],
            }).compile();

            this.App = moduleFixture.createNestApplication();
            this._dataSource = this.App.get(DataSource);
            await this._dataSource.runMigrations({ transaction: 'all' });
            const configService = this.App.get(ConfigService);
            const sessionsConfig = configService.get('express-session');
            const sessionStorage = new TypeormStore({ cleanupLimit: 2 });
            const sessionStore = sessionStorage.connect(this._dataSource.getRepository(SessionEntity));

            this.App.use(session({ store: sessionStore, ...sessionsConfig }));
            this.App.use(passport.initialize());
            this.App.use(passport.session());
            await this.App.init();
        });

        afterAll(() => this.App.close());

        beforeEach(() => {
            this._anonClient = new TestClient(this.App.getHttpServer());

            const authHeader = new Map<string, string>();
            authHeader.set('Authorization', 'Bearer user1-test-upload-token');
            this._shikiAuthClient = new TestClient(this.App.getHttpServer(), authHeader);
        });
    }
}
