import { Module } from '@nestjs/common';
import { AdminUserController } from './admin-user.controller';
import { UserSharedModule } from '../../../../services/user/user.shared.module';

@Module({
    imports: [UserSharedModule],
    controllers: [AdminUserController],
})
export class AdminUserModule {}
