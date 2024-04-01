import { AdminVideoRequestsController } from '~backend/routes/api/admin/requests/video/admin-video-requests.controller';
import { Module } from '@nestjs/common';
import { UserSharedModule } from '~backend/services/user/user.shared.module';
import { VideoRequestsSharedModule } from '~backend/services/requests/video/video-requests.shared.module';

@Module({
    imports: [
        UserSharedModule,
        VideoRequestsSharedModule,
    ],
    controllers: [AdminVideoRequestsController],
})
export class AdminVideoRequestsModule { }
