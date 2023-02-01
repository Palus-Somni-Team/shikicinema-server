import { Module } from '@nestjs/common';
import { RouterModule, Routes } from 'nest-router';

import { AdminModule } from '@app-routes/api/admin/admin.module';
import { AdminUserModule } from '@app-routes/api/admin/user/admin-user.module';
import { AdminVideoModule } from '@app-routes/api/admin/video/admin-video.module';
import { ApiModule } from '@app-routes/api/api.module';
import { AuthModule } from '@app-routes/auth/auth.module';
import { AuthorModule } from '@app-routes/api/author/authors.module';
import { OAuthModule } from '@app-routes/oauth/oauth.module';
import { UserModule } from '@app-routes/api/user/user.module';
import { VideoModule } from '@app-routes/api/video/video.module';

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
                ],
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
