import { AdminUserModule } from './user/admin-user.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [AdminUserModule],
})
export class AdminModule {}
