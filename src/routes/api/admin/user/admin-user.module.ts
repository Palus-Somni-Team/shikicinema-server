import { Module } from '@nestjs/common';

import { AdminUserController } from '@app-routes/api/admin/user/admin-user.controller';
import { UserSharedModule } from '@app-services/user/user.shared.module';

@Module({
    imports: [UserSharedModule],
    controllers: [AdminUserController],
})
export class AdminUserModule {}
