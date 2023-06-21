import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DestroyService } from '@core/services/destroy.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthAction } from '../../state/auth.action';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class AuthPageComponent implements OnInit {
 form = this._fb.group({
   login: [],
   password: []
 })

  constructor(
    private readonly _store: Store,
    private readonly _fb: FormBuilder,
    private readonly _destroy$: DestroyService,
    private readonly _router: Router,
    private readonly _api: AuthApiService
  ) { }

  ngOnInit() {
  }

  async auth() {
    const { login, password } = this.form.value as any;
    this._store.dispatch(AuthAction.Login({login, password}));
  }
}
