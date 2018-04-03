import {Component, OnInit} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {AuthService} from '../services/auth.service';
import {LoginPage} from '../pages/login/login';
import {DictionaryService} from '../services/dictionary.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage: any = TabsPage;


  constructor(platform: Platform, statusBar: StatusBar,
              splashScreen: SplashScreen, private authService: AuthService, dict: DictionaryService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn.getValue() !== false)
      this.rootPage = TabsPage;
    else
      this.rootPage = LoginPage;

    this.authService.isLoggedIn.subscribe(
      (data) => {
        if (data)
          this.rootPage = TabsPage;
        else
          this.rootPage = LoginPage;
      }
    );
  }
}
