import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { UsersRoutingModule } from './users-routing.module';


@NgModule({
    declarations: [
        UsersPageComponent,
    ],
    imports: [
        CommonModule,
        UsersRoutingModule,
    ],
})
export class UsersModule { }
