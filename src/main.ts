import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { TypeormStore } from 'connect-typeorm';

import { AppModule } from '@app/app.module';
import { SessionEntity } from '@app-entities';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    const configService = app.get(ConfigService);
    const serverPort = configService.get('server-port');
    const sessionsConfig = configService.get('express-session');
    const sessionStorage = new TypeormStore({ cleanupLimit: 2 });
    const sessionStore = sessionStorage.connect(dataSource.getRepository(SessionEntity));

    app.use(session({ store: sessionStore, ...sessionsConfig }));
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(serverPort);
}

bootstrap();
