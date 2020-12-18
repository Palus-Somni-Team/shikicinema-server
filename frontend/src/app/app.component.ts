import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
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
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('admin/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
