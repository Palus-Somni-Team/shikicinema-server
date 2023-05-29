import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthStoreService } from '../../services/auth-store.service';
import { DestroyService } from '@core/services/destroy.service';
import { filter, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  providers: [DestroyService]
})
export class AuthPageComponent implements OnInit {
 form = this._fb.group({
   login: [],
   password: []
 })

  constructor(
    private readonly _store: AuthStoreService,
    private readonly _fb: FormBuilder,
    private readonly _destroy$: DestroyService,
    private readonly _router: Router
  ) { }

  ngOnInit() {
   this._store.user$
     .pipe(filter(Boolean), takeUntil(this._destroy$))
     .subscribe(() => this._router.navigateByUrl(''));
  }

  auth() {
    const { login, password } = this.form.value as any;
    this._store.login(login, password);
  }
}
