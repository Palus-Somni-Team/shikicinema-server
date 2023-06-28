import { AuthGuard } from './auth/services/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from './layout/layout.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        LayoutModule,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
