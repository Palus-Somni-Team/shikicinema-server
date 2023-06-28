import { AdminUser } from '@shikicinema/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    readonly api = environment.api;
    constructor(private _httpService: HttpClient) { }

    auth(login: string, password: string) {
        const body = { login, password };
        return this._httpService.post<AdminUser>(`${this.api}/auth/login`, body);
    }

    me() {
        return this._httpService.get<AdminUser>(`${this.api}/auth/me`);
    }

    logout() {
        return this._httpService.post(`${this.api}/auth/logout`, {});
    }
}
