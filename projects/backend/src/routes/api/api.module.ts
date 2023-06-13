import { Module } from '@nestjs/common';

import { AdminModule } from '~backend/routes/api/admin/admin.module';
import { AuthorModule } from '~backend/routes/api/author/authors.module';
import { UploadersModule } from '~backend/routes/api/uploaders/uploaders.module';
import { UserModule } from '~backend/routes/api/user/user.module';
import { VideoModule } from '~backend/routes/api/video/video.module';
import { VideoRequestsModule } from '~backend/routes/api/requests/video/video-requests.module';

@Module({
    imports: [
        AdminModule,
        AuthorModule,
        UserModule,
        VideoModule,
        VideoRequestsModule,
        UploadersModule,
    ],
})
export class ApiModule {}
