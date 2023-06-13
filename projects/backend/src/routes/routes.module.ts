import { Module } from '@nestjs/common';
import { RouterModule, Routes } from 'nest-router';

import { AdminModule } from '~backend/routes/api/admin/admin.module';
import { AdminUploadersModule } from '~backend/routes/api/admin/uploaders/admin-uploaders.module';
import { AdminUserModule } from '~backend/routes/api/admin/user/admin-user.module';
import { AdminVideoModule } from '~backend/routes/api/admin/video/admin-video.module';
import { ApiModule } from '~backend/routes/api/api.module';
import { AuthModule } from '~backend/routes/auth/auth.module';
import { AuthorModule } from '~backend/routes/api/author/authors.module';
import { OAuthModule } from '~backend/routes/oauth/oauth.module';
import { RequestsModule } from '~backend/routes/api/requests/requests.module';
import { UploadersModule } from '~backend/routes/api/uploaders/uploaders.module';
import { UserModule } from '~backend/routes/api/user/user.module';
import { VideoModule } from '~backend/routes/api/video/video.module';
import { VideoRequestsModule } from '~backend/routes/api/requests/video/video-requests.module';

const routes: Routes = [
    {
        path: '/auth',
        module: AuthModule,
    },
    {
        path: '/api',
        module: ApiModule,
        children: [
            {
                path: '/authors',
                module: AuthorModule,
            },
            {
                path: '/users',
                module: UserModule,
            },
            {
                path: '/videos',
                module: VideoModule,
            },
            {
                path: '/admin',
                module: AdminModule,
                children: [
                    {
                        path: '/users',
                        module: AdminUserModule,
                    },
                    {
                        path: '/videos',
                        module: AdminVideoModule,
                    },
                    {
                        path: '/uploaders',
                        module: AdminUploadersModule,
                    },
                ],
            },
            {
                path: '/requests',
                module: RequestsModule,
                children: [
                    {
                        path: '/videos',
                        module: VideoRequestsModule,
                    },
                ],
            },
            {
                path: '/uploaders',
                module: UploadersModule,
            },
        ],
    },
];

@Module({
    imports: [
        RouterModule.forRoutes(routes),
        ApiModule,
        AuthModule,
        OAuthModule,
    ],
})
export class RoutesModule {}
