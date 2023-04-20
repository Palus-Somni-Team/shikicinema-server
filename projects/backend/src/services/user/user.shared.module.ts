import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploaderSharedModule } from '~backend/services/uploader/uploader.shared.module';
import { UserEntity } from '~backend/entities';
import { UserService } from '~backend/services/user/user.service';

@Module({
    providers: [UserService],
    imports: [
        forwardRef(() => UploaderSharedModule),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    exports: [UserService],
})
export class UserSharedModule {}
