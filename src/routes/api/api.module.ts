import { Module } from '@nestjs/common';

import { AdminModule } from '@app-routes/api/admin/admin.module';
import { AuthorModule } from '@app-routes/api/author/authors.module';
import { UserModule } from '@app-routes/api/user/user.module';
import { VideoModule } from '@app-routes/api/video/video.module';

@Module({
    imports: [AdminModule, AuthorModule, UserModule, VideoModule],
})
export class ApiModule {}
