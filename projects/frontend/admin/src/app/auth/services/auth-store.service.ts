import { Injectable } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { BehaviorSubject, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminUser } from '@shikicinema/types';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  readonly user$ = new BehaviorSubject<AdminUser | null>(null);

  constructor(
    private readonly _api: AuthApiService,
    private readonly _snackBar: MatSnackBar
  ) { }

  login(login: string, password: string) {
    return this._api.auth(login, password)
      .pipe(take(1))
      .subscribe(
        (user) => {
          this.user$.next(user);
          this._snackBar.open('Вы успешно авторизованы');
        },
        (error: string) => this._snackBar.open(error || 'Попробуйте позже')
      );
  }

  me() {
    return this._api.me()
      .pipe(take(1))
      .subscribe((user) => this.user$.next(user));
  }
}
