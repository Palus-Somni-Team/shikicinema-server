import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, Module } from '@nestjs/common';
import { ShikimoriClient } from './shikimori.client';

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
