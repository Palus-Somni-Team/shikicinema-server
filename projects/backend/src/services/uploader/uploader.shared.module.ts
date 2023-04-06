import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploaderEntity } from '~backend/entities';
import { UploaderService } from '~backend/services/uploader/uploader.service';
import { UserSharedModule } from '~backend/services/user/user.shared.module';

@Module({
    imports: [
        forwardRef(() => UserSharedModule),
        TypeOrmModule.forFeature([UploaderEntity]),
    ],
    providers: [UploaderService],
    exports: [UploaderService],
})
export class UploaderSharedModule {}
