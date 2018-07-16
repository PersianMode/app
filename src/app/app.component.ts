import {Component, OnInit, ViewChild} from '@angular/core';
import {Nav, NavController, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TabsPage} from '../pages/tabs/tabs';
import {AuthService} from '../services/auth.service';
import {LoginPage} from '../pages/login/login';
import {DictionaryService} from '../services/dictionary.service';
import {Deeplinks} from '@ionic-native/deeplinks';
import {RegConfirmationPage} from '../pages/regConfirmation/regConfirmation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage: any = TabsPage;

  @ViewChild(Nav) navChild: NavController;


  constructor(private platform: Platform, statusBar: StatusBar,
              splashScreen: SplashScreen, private authService: AuthService,
              dict: DictionaryService, private deeplinks: Deeplinks,
              private toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (this.platform.is('cordova'))
        this.deepLinkToActivationLink();
    }).catch(err => {
      this.toastCtrl.create({
        message: `what? not ready?! ${JSON.stringify(err)}`,
        duration: 5000
      }).present();
    });
  }

  /**
   * <plugin name="cordova-plugin-googleplus" spec="^5.3.0">
   <variable name="REVERSED_CLIENT_ID" value="com.googleusercontent.apps.855842568245-15155fb0fep4v2gpdjg0nd1gaas2n7nv" />
   <variable name="WEB_APPLICATION_CLIENT_ID" value="855842568245-c0q8sm090cpd377em1k0hgrtphdgdvc9.apps.googleusercontent.com" />
   </plugin>
   */

  ngOnInit() {
    this.authService.isFullAuthenticated.subscribe(
      (data) => {
        console.log('INPUTS:', data, this.authService.userData.is_preferences_set);
        if (data && this.authService.userData.is_preferences_set) {
          this.rootPage = TabsPage;
          console.log('changes take effect here!', data, this.authService.userData);
        }
        else {
          console.log('isFullAuth->false (login page)');
          this.rootPage = LoginPage;
        }
      }
    );
  }

  deepLinkToActivationLink() {
    // TODO: might be conflicted with the rootPage setting in ngOnInit!
    this.deeplinks.routeWithNavController(this.navChild, {
      '/login/oauth/:activation_link': RegConfirmationPage
    }).subscribe(
      match => {
        // TODO: should test this in real app!
        this.toastCtrl.create({
          message: 'IN THE MATCH PART!',
          duration: 5000,
        }).present();
      },
      nomatch => {
        // TODO: should test this in real app!
        this.toastCtrl.create({
          message: 'in the no match part!',
          duration: 5000,
        }).present();
      }
    );
  }

  // ngAfterViewInit() {
  //   this.platform.ready().then(() => {
  //
  //   });
  // }
}
