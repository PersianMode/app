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
      console.warn('Platform not ready');
    });
  }

  /**
   * <plugin name="cordova-plugin-googleplus" spec="^5.3.0">
   <variable name="REVERSED_CLIENT_ID" value="com.googleusercontent.apps.855842568245-15155fb0fep4v2gpdjg0nd1gaas2n7nv" />
   <variable name="WEB_APPLICATION_CLIENT_ID" value="855842568245-c0q8sm090cpd377em1k0hgrtphdgdvc9.apps.googleusercontent.com" />
   </plugin>

   * "cordova-plugin-googleplus": {
        "REVERSED_CLIENT_ID": "com.googleusercontent.apps.636231560622-fivtnnfsd7ctdtonslikbu5elmm69mrv",
        "WEB_APPLICATION_CLIENT_ID": "636231560622-hr7vctis0fsihrf8gomv1seug37tl695.apps.googleusercontent.com"
      }
   */
  /**
   * Common Issues!
   * make sure the http requests goes to where your server is running!
   * if the google-plus couldn't login, the above 'plugin semi-codes' can be useful
   * the app might need to have a signed APK (especially for release)
   * if everything was OK but couldn't build, try re-cloning the app and do the process again:
        git clone ...
        (if necessary, pull from previous branch)
        npm i
        ionic cordova build android
        then in the Android Studio, rebuild the project and Run. Somethings might need changing:
          /app/src/main/AndroidManifest.xml
            -> change 'minSdkVersion' to 23
          /cordova/lib/builders/GradleBuilder.js and StudioBuilder.js
            -> in 'getArgs' function, set '-Dorg.gradle.daemon=false' and '-Dorg.gradle.jvmargs=-Xmx512M'
          /app/build.gradle
            -> change the consecutive 'compile's to 'implement', as the former is deprecated
            -> change the versions might be needed
   * more errors in building ionic
        use --prod to see if there isn't any issue with the code itself
        use these links for VM Heap errors:
          https://stackoverflow.com/questions/26143740/getting-gradle-error-could-not-reserve-enough-space-for-object-heap-constantly
          https://docs.gradle.org/current/userguide/build_environment.html#sec:configuring_jvm_memory
        make sure you're using VPN, as google things need that
        sometimes it errors but it actually builds!
   */
  /**
   * NEWLY Common Issues!!!
   * there's definitely some build errors in android studio gradle sync and build, hence the above issues:
        in /app/build.gradle:
          -> change all 'compile's to 'implementation' (not 'implement')!
          -> add "apply plugin: 'com.google.gms.google-services'" (if already exists, move it) to the very end of the file
          -> add "google()" before "mavenCentral()" in "buildscript.repositories" and "allprojects.repositories"
          -> also add 'maven { url "https://maven.google.com" }' after the mentioned "mavenCentral()"s
          -> in "buildscript.dependencies", there must be these:
              classpath 'com.android.tools.build:gradle:3.1.2'
              classpath 'com.google.gms:google-services:4.0.1'
          -> versions of google-play-* needs to match, so the problem might be from here!
        in build.gradle (root project):
          -> change those "mavenCentral()" related things mentioned above in here too!
   * if encountered "google play service update" after syncing and building and running in emulator,
        you should check that the API level and the platform you chose supports Google Play (not Google API)
        (Nexus 5 and 5X platforms supports this) then you can update them inside emulator in its google play
        other than that, there doesn't seem to be any option!
   */
  /**
   * Any changes made to the project, must be followed with these steps respectively for building:
    -> run: ionic cordova build android
    -> go to android studio, fix the probable above issues (compile, versions, etc.) and sync and build
        --> after first configuration and sync and build, each time, only changing sdk version to "23" is needed
    -> run on device or emulator!
    -> for iOS, the clientIds and reverse ones must be changed according to the iOS API Key!
   */

  ngOnInit() {
    this.authService.isFullAuthenticated.subscribe(
      (data) => {
        if (data && this.authService.userData.is_preferences_set) {
          this.rootPage = TabsPage;
        }
        else {
          this.rootPage = LoginPage;
        }
      }
    );
  }

  deepLinkToActivationLink() {
    // TODO: might be conflicted with the rootPage setting in ngOnInit!
    // TODO: should test this in real app (in real server)!
    this.deeplinks.routeWithNavController(this.navChild, {
      '/login/oauth/:activation_link': RegConfirmationPage
    }).subscribe(
      match => {
        this.toastCtrl.create({
          message: 'IN THE MATCH PART!',
          duration: 5000,
        }).present();

        let urlParts = match.$link.url.split('/');

        if (urlParts[2] === 'login' && urlParts[3] === 'oauth') {
          this.navChild.push(RegConfirmationPage, {
            activation_link: urlParts[4]
          });
        }
      },
      nomatch => {
        this.toastCtrl.create({
          message: 'in the no match part!',
          duration: 5000,
        }).present();
      }
    );
  }
}
