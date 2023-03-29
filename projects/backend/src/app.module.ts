import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AxiosShikimoriConfig from '~backend/config/axios-shikimori.config';
import DatabaseConfig from '~backend/config/database.config';
import ExpressSessionConfig from '~backend/config/express-session.config';
import ServerPortConfig from '~backend/config/server-port.config';
import ShikimoriOAuthConfig from '~backend/config/shikimori-oauth.config';
import { RoutesModule } from '~backend/routes/routes.module';

@Module({
    imports: [
        RoutesModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                AxiosShikimoriConfig,
                DatabaseConfig,
                ExpressSessionConfig,
                ServerPortConfig,
                ShikimoriOAuthConfig,
            ],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.get('database'),
        }),
    ],
    controllers: [],
})
export class AppModule {}
