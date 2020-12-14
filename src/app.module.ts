import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { AuthModule } from './auth/auth.module';
import DatabaseConfig from './config/database.config';
import AxiosShikimoriConfig from './config/axios-shikimori.config';
import ExpressSessionConfig from './config/express-session.config';

@Module({
  imports: [
    AdminUserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AxiosShikimoriConfig,
        DatabaseConfig,
        ExpressSessionConfig
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => config.get('database'),
    }),
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
