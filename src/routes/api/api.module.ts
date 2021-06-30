import { AdminModule } from './admin/admin.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

@Module({
    imports: [AdminModule, UserModule],
})
export class ApiModule {}
