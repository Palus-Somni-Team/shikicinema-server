import { Component, OnInit } from '@angular/core';
import { OwnerUserInfo } from '@shikicinema';
import { Observable } from 'rxjs';

import { ApiService } from '../services/api/api.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  public selectedIndex = 0;
  public user$: Observable<OwnerUserInfo>;
  public dashboardPages = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: 'pulse'
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: 'people'
    },
    {
      title: 'Tokens',
      url: '/admin/tokens',
      icon: 'key'
    },
    {
      title: 'Videos',
      url: '/admin/videos',
      icon: 'film'
    },
    {
      title: 'Requests',
      url: '/admin/requests',
      icon: 'chatbox'
    },
    {
      title: 'Notifications',
      url: '/admin/notifications',
      icon: 'notifications'
    }
  ];

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  async ngOnInit() {
    const path = window.location.pathname.split('admin/')[1];

    switch (path) {
      case 'profile':
        this.selectedIndex = 0;
        break;
      default:
        const pageIndex = this.dashboardPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        this.selectedIndex = +pageIndex + 1;
    }

    this.user$ = this.api.auth.user$;
  }

  async onLogout() {
    this.api.auth.logout()
      .pipe(
        switchMap(() => this.router.navigate(['/login']))
      )
      .subscribe();
  }

}
