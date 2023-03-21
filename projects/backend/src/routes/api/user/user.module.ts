import { Module } from '@nestjs/common';

import { UserController } from '~backend/routes/api/user/user.controller';
import { UserSharedModule } from '~backend/services/user/user.shared.module';

@Module({
    controllers: [UserController],
    imports: [UserSharedModule],
})
export class UserModule {}
