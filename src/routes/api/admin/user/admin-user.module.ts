import { AdminUserController } from './admin-user.controller';
import { Module } from '@nestjs/common';
import { UserSharedModule } from '../../../../services/user/user.shared.module';

@Module({
    imports: [UserSharedModule],
    controllers: [AdminUserController],
})
export class AdminUserModule {}
