import { Module } from '@nestjs/common';

import { UserController } from '@app-routes/api/user/user.controller';
import { UserSharedModule } from '@app-services/user/user.shared.module';

@Module({
    controllers: [UserController],
    imports: [UserSharedModule],
})
export class UserModule {}
