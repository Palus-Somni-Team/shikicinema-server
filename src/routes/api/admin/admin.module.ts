import { Module } from '@nestjs/common';

import { AdminUserModule } from '@app-routes/api/admin/user/admin-user.module';
import { AdminVideoModule } from '@app-routes/api/admin/video/admin-video.module';

@Module({
    imports: [AdminUserModule, AdminVideoModule],
})
export class AdminModule {}
