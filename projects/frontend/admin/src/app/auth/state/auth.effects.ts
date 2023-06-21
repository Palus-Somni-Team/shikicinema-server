import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { AuthAction } from './auth.action';
import { map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';
import { AdminUser } from '@shikicinema/types';
import { Action } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  constructor(
    private readonly _actions$: Actions,
    private readonly _router: Router,
    private readonly _api: AuthApiService
  ) {}

  logout$ = createEffect(() => this._actions$.pipe(
    ofType(AuthAction.Logout),
    tap(() => this._router.navigateByUrl('/auth'))
  ));

  login$ = createEffect(() => this._actions$.pipe(
    ofType(AuthAction.Login),
    switchMap(action => this._api.auth(action.login, action.password)),
    map(user => AuthAction.LoginSuccess(user as AdminUser))
  ));

  loginSuccess$ = createEffect(() => this._actions$.pipe(
    ofType(AuthAction.LoginSuccess),
    tap(() => this._router.navigateByUrl(''))
  ), { dispatch: false });

  init$ = createEffect(() => this._actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    switchMap(() => this._api.me()),
    map(user => AuthAction.Check(user))
  ));
}
