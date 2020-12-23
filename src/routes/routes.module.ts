import { Module } from '@nestjs/common';
import { RouterModule, Routes } from 'nest-router';

import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { UserModule } from './api/user/user.module';
import { AdminModule } from './api/admin/admin.module';
import { AdminUserModule } from './api/admin/user/admin-user.module';

const routes: Routes = [
  {
    path: '/auth',
    module: AuthModule
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
        path: '/admin',
        module: AdminModule,
        children: [
          {
            path: '/user',
            module: AdminUserModule,
          }
        ]
      },
    ]
  }
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ApiModule,
    AuthModule,
  ],
})
export class RoutesModule {}
