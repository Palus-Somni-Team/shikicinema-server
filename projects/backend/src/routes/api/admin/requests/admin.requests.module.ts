import { AdminVideoRequestsModule } from '~backend/routes/api/admin/requests/video/admin-video-requests.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [AdminVideoRequestsModule],
})
export class AdminRequestsModule {
}
