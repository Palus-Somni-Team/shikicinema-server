import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '~backend/app.module';
import { initSession, initSwagger } from '~backend/utils/bootstrap.utils';

async function bootstrap() {
    // TODO: Возможно надо удалить options
    const app = await NestFactory.create(AppModule, { cors: { credentials: true, origin: true } });
    const dataSource = app.get(DataSource);
    const configService = app.get(ConfigService);
    const serverPort = configService.get('server-port');

    initSession(app, dataSource, configService);
    initSwagger(app);

    await app.listen(serverPort);
}

bootstrap();
