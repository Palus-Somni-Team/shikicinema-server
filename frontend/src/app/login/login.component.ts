import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    readonly api: ApiService,
    readonly router: Router,
    private _toastController: ToastController
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      login: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32),
        ])
      ),
    });
  }

  async onSubmit(credentials: { login: string; password: string }) {
    const loginFailedToast = await this._toastController.create({
      message: 'Login or password is invalid',
      duration: 2000,
      color: 'warning',
    });

    this.api.auth.login(credentials.login, credentials.password)
      .subscribe(
        async () => await this.router.navigate(['/admin/dashboard']),
        async () => await loginFailedToast.present()
      );
  }

}
