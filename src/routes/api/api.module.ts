import { Module } from '@nestjs/common';

import { AdminModule } from '@app-routes/api/admin/admin.module';
import { UserModule } from '@app-routes/api/user/user.module';
import { VideoModule } from '@app-routes/api/video/video.module';

@Module({
    imports: [AdminModule, UserModule, VideoModule],
})
export class ApiModule {}
