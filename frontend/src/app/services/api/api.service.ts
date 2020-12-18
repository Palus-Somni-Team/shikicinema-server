import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private _auth: AuthService
  ) {}

  get auth() {
    return this._auth;
  }
}
