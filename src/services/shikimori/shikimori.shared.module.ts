import { HttpModule, Module } from '@nestjs/common';
import { ShikimoriClient } from './shikimori.client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get('axios-shikimori'),
        }),
    ],
    providers: [ShikimoriClient],
    exports: [ShikimoriClient],
})
export class ShikimoriSharedModule {}
