import { Component, OnInit } from '@angular/core';
import { AuthStoreService } from './auth/services/auth-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'admin';

  constructor(
    private readonly _authStore: AuthStoreService
  ) {
  }

  ngOnInit() {
    this._authStore.me();
  }
}
