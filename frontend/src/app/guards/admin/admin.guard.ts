import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { Role } from '@shikicinema';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.api.auth.user$
      .pipe(
        switchMap((user) => {
          const can = user !== null && this.api.auth.hasRole(Role.admin, user?.roles);
          const redirectToLogin = this.router.parseUrl('/login');

          return of(can ? true : redirectToLogin);
        })
      );
  }

}
