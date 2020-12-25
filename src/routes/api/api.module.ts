import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';

@Module({
    imports: [AdminModule, UserModule, VideoModule],
})
export class ApiModule {}
