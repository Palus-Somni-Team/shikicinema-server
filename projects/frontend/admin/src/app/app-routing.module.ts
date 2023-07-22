import { AuthGuard } from './auth/services/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth-routing.module').then((m) => m.AuthRoutingModule),
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./dashboard/dashboard-routing.module').then((m) => m.DashboardRoutingModule),
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users-routing.module').then((m) => m.UsersRoutingModule),
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
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
