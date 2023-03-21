import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '~backend/entities';
import { UserService } from '~backend/services/user/user.service';

@Module({
    providers: [UserService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
    exports: [UserService],
})
export class UserSharedModule {}
