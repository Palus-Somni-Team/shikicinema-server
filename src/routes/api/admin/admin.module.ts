import { Module } from '@nestjs/common';

import { AdminUserModule } from './user/admin-user.module';
import { AdminVideoModule } from './video/admin-video.module';

@Module({
    imports: [AdminUserModule, AdminVideoModule],
})
export class AdminModule {}
