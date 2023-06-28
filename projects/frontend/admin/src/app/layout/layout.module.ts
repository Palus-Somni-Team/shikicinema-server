import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './layout.component';
import { MenuComponent } from './components/menu/menu.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
        LayoutComponent,
        MenuComponent,
        HeaderComponent,
    ],
    exports: [
        LayoutComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        BrowserModule,
        BrowserAnimationsModule,
    ],
})
export class LayoutModule { }
