import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OwnerUserInfo, Role, RegisterUserRequest } from '@shikicinema';
import { Observable, ReplaySubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {
    this.me()
      .subscribe((user) => this._userSubject.next(user));
  }

  private _userSubject = new ReplaySubject<OwnerUserInfo>(1);

  public get user$(): Observable<OwnerUserInfo> {
    return this._userSubject.asObservable();
  }

  public hasRole(role: Role, roles: Role[]): boolean {
    const stringRole = Role[role];
    return roles?.some((r: any) => r == stringRole);
  }

  public login(login: string, password: string): Observable<OwnerUserInfo> {
    return this.http.post<OwnerUserInfo>('/auth/login', { login, password })
      .pipe(
        tap((user) => this._userSubject.next(user))
      );
  }

  public logout(): Observable<void> {
    return this.http.post<void>('/auth/logout', {})
      .pipe(
        tap(() => this._userSubject.next(null))
      );
  }

  public me(): Observable<OwnerUserInfo> {
    return this.http.get<OwnerUserInfo>('/auth/me');
  }

  public register(login: string, password: string, email: string): Observable<OwnerUserInfo> {
    const body: RegisterUserRequest = { login, password, email };
    return this.http.post<OwnerUserInfo>('/auth/register', body)
      .pipe(
        switchMap(() => this.login(login, password))
      );
  }
}
