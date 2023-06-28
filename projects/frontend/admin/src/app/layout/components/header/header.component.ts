import { AuthAction } from '../../../auth/state/auth.action';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'header' },
})
export class HeaderComponent {
    constructor(
        private readonly _store: Store,
        private readonly _router: Router
    ) { }

    async logout() {
        this._store.dispatch(AuthAction.Logout());
    }
}
