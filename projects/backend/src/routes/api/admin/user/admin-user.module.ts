import { Module } from '@nestjs/common';

import { AdminUserController } from '~backend/routes/api/admin/user/admin-user.controller';
import { UserSharedModule } from '~backend/services/user/user.shared.module';

@Module({
    imports: [UserSharedModule],
    controllers: [AdminUserController],
})
export class AdminUserModule {}
