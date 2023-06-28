import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
        AuthPageComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class AuthModule { }
