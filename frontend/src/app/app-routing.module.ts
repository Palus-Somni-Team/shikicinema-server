import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './guards/admin/admin.guard';
import { LoginComponent } from './login/login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { LoginGuard } from './guards/login/login.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: LoginComponent
  },
  {
    path: 'admin',
    redirectTo: 'admin/dashboard'
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    component: AdminPanelComponent,
    children: [
      {
        path: ':id',
        loadChildren: () => import('./folder/folder.module').then((m) => m.FolderPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  providers: [
    AdminGuard,
    LoginGuard,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
