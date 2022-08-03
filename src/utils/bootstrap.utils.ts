import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { TypeormStore } from 'connect-typeorm';

import { SessionEntity } from '@app-entities';

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
    const config = new DocumentBuilder()
        .setTitle('Shikicinema Swagger')
        .setDescription('API requests builder & documentation')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);
}
