import { Module } from '@nestjs/common';

import { AdminModule } from '~backend/routes/api/admin/admin.module';
import { AuthorModule } from '~backend/routes/api/author/authors.module';
import { UserModule } from '~backend/routes/api/user/user.module';
import { VideoModule } from '~backend/routes/api/video/video.module';

@Module({
    imports: [AdminModule, AuthorModule, UserModule, VideoModule],
})
export class ApiModule {}
