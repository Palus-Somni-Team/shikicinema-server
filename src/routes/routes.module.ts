import { Module } from '@nestjs/common';
import { RouterModule, Routes } from 'nest-router';

import { AdminModule } from './api/admin/admin.module';
import { AdminUserModule } from './api/admin/user/admin-user.module';
import { AdminVideoModule } from './api/admin/video/admin-video.module';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './api/user/user.module';
import { VideoModule } from './api/video/video.module';

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
                path: '/user',
                module: UserModule,
            },
            {
                path: '/video',
                module: VideoModule,
            },
            {
                path: '/admin',
                module: AdminModule,
                children: [
                    {
                        path: '/user',
                        module: AdminUserModule,
                    },
                    {
                        path: '/video',
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
    ],
})
export class RoutesModule {}
