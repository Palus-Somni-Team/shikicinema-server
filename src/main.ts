import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@app/app.module';
import { initSession, initSwagger } from '@app-utils/bootstrap.utils';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    const configService = app.get(ConfigService);
    const serverPort = configService.get('server-port');

    initSession(app, dataSource, configService);
    initSwagger(app);

    await app.listen(serverPort);
}

bootstrap();
