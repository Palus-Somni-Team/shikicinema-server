import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterUserRequest, Role } from '@shikicinema';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../../../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userSubject = new ReplaySubject<User>(1);

  private _mapToUser = map((resBody: any) => new User(
    resBody.id,
    resBody.login,
    resBody.email,
    resBody.name,
    resBody.roles,
    resBody.shikimoriId,
    resBody.createdAt,
    resBody.updatedAt
  ));

  constructor(
    private http: HttpClient
  ) {
    this.me()
      .pipe(
        catchError(() => of(null as User))
      )
      .subscribe(
        (user) => this._userSubject.next(user)
      );
  }

  public get user$(): Observable<User> {
    return this._userSubject.asObservable();
  }

  public hasRole(role: Role, roles: Role[]): boolean {
    return roles?.some((r) => r === role);
  }

  public login(login: string, password: string): Observable<User> {
    return this.http.post<any>('/auth/login', { login, password })
      .pipe(
        this._mapToUser,
        tap((user) => this._userSubject.next(user))
      );
  }

  public logout(): Observable<void> {
    return this.http.post<void>('/auth/logout', {})
      .pipe(
        tap(() => this._userSubject.next(null))
      );
  }

  public me(): Observable<User> {
    return this.http.get<any>('/auth/me')
      .pipe(this._mapToUser);
  }

  public register(login: string, password: string, email: string): Observable<User> {
    const body: RegisterUserRequest = { login, password, email };
    return this.http.post<any>('/auth/register', body)
      .pipe(
        this._mapToUser,
        switchMap(() => this.login(login, password))
      );
  }
}
