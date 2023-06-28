import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgModule } from '@angular/core';


@NgModule({
    declarations: [
        DashboardPageComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
    ],
})
export class DashboardModule { }
