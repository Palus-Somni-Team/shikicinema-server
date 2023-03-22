import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AxiosShikimoriConfig from '@app-config/axios-shikimori.config';
import DatabaseConfig from '@app-config/database.config';
import ExpressSessionConfig from '@app-config/express-session.config';
import ServerPortConfig from '@app-config/server-port.config';
import ShikimoriOAuthConfig from '@app-config/shikimori-oauth.config';
import { RoutesModule } from '@app-routes/routes.module';

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
