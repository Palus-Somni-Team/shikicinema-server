import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { TypeormStore } from 'connect-typeorm';

import { SessionEntity } from '~backend/entities';

export function initSession(
    app: INestApplication,
    dataSource: DataSource,
    configService: ConfigService,
): void {
    const sessionStorage = new TypeormStore({ cleanupLimit: 2 });
    const sessionStore = sessionStorage.connect(dataSource.getRepository(SessionEntity));
    const sessionsConfig = configService.get('express-session');

    app.use(session({ store: sessionStore, ...sessionsConfig }));
    app.use(passport.initialize());
    app.use(passport.session());
}

export function initSwagger(app: INestApplication): void {
    const apiDocVersion = '1.0';
    const config = new DocumentBuilder()
        .setTitle('Shikicinema Swagger')
        .setDescription('API requests builder & documentation')
        .setVersion(apiDocVersion)
        .addCookieAuth()
        .addSecurity('bearer', {
            type: 'apiKey',
            in: 'headers',
            name: 'Shikimori Authorization',
            description: 'Shikimori Bearer Token',
        })
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(`api/${apiDocVersion}`, app, document);
}
