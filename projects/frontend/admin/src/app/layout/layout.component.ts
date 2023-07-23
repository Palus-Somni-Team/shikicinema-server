import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { AuthAction } from '~admin-root/app/auth/state/auth.action';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'layout' },
    standalone: true,
    imports: [RouterModule, MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule]
})
export class LayoutComponent {
    constructor(
        private readonly _store: Store,
        private readonly _router: Router
    ) { }

    logout() {
        this._store.dispatch(AuthAction.Logout());
    }
}
