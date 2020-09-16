import { HttpModule, Module } from '@nestjs/common';
import { ShikimoriClient } from './shikimori.client';

@Module({
  imports: [
    // TODO: config service needed
    HttpModule.register({
      baseURL: 'https://shikimori.one',
      headers: {
        'User-Agent': 'Shikicinema Server Auth Service; https://github.com/Palus-Somni-Team/shikicinema-server',
      },
      timeout: 1000
    }),
  ],
  providers: [ShikimoriClient],
  exports: [ShikimoriClient],
})
export class ShikimoriSharedModule {}
