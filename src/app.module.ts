import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import DatabaseConfig from './config/database.config';
import AxiosShikimoriConfig from './config/axios-shikimori.config';
import ExpressSessionConfig from './config/express-session.config';
import ServerPortConfig from './config/server-port.config';
import { RoutesModule } from './routes/routes.module';

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
            ],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => config.get('database'),
        }),
    ],
    controllers: [],
})
export class AppModule {}
