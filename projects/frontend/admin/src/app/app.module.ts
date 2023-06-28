import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthEffects } from './auth/state/auth.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CredentialsInterceptor } from '@core/interceptors/credentials.interceptor';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './auth/state/auth.reducer';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,
        MatSnackBarModule,
        StoreModule.forRoot({ auth: authReducer }, {}),
        EffectsModule.forRoot([AuthEffects]),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CredentialsInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
