import { Module } from '@nestjs/common';

import { AdminRequestsModule } from '~backend/routes/api/admin/requests/admin.requests.module';
import { AdminUserModule } from '~backend/routes/api/admin/user/admin-user.module';
import { AdminVideoModule } from '~backend/routes/api/admin/video/admin-video.module';

@Module({
    imports: [
        AdminUserModule,
        AdminVideoModule,
        AdminRequestsModule,
    ],
})
export class AdminModule {}
