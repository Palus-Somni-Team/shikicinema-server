import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  createUrlTreeFromSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';
import { AuthStoreService } from './auth-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly _store: AuthStoreService,
    private readonly _router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<UrlTree | boolean> {
    return this._store.user$.pipe(map(user => user ? true: this._router.createUrlTree(['/auth'])));
  }

}
