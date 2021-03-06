import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { TypeormStore } from 'connect-typeorm';
import { getRepository } from 'typeorm';

import { AppModule } from './app.module';
import { SessionEntity } from '@app-entities';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const serverPort = configService.get('server-port');
    const sessionsConfig = configService.get('express-session');
    const sessionStorage = new TypeormStore({ cleanupLimit: 2 });
    const sessionStore = sessionStorage.connect(getRepository(SessionEntity));

    app.use(session({ store: sessionStore, ...sessionsConfig }));
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(serverPort);
}

bootstrap();
