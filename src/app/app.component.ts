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
import {LoadingService} from '../services/loadingService';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage: any = LoginPage;

  @ViewChild(Nav) navChild: NavController;


  constructor(private platform: Platform, statusBar: StatusBar,
    splashScreen: SplashScreen, private authService: AuthService,
    dict: DictionaryService, private deeplinks: Deeplinks,
    private toastCtrl: ToastController, private loadingService: LoadingService) {
    this.loadingService.enable({}, 0, () => {
      this.authService.checkIsUserValid()
      .then(res => {
        this.loadingService.disable();
        this.rootPage = TabsPage;
      })
      .catch(err => {
        this.loadingService.disable();
        this.rootPage = LoginPage;
        console.error("error in initial validating user: ", err);
      });
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // if (this.platform.is('cordova'))
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
              one that might work: (outdated, maybe)
                 implementation "com.squareup.okhttp3:okhttp-urlconnection:3.10.0"
                 implementation "com.google.android.gms:play-services-maps:15.0.1"
                 implementation "com.google.android.gms:play-services-location:15.0.1"
                 implementation "com.android.support:support-core-utils:24.1.0"
                 implementation "com.google.android.gms:play-services-auth:15.0.1"
                 implementation "com.google.android.gms:play-services-identity:15.0.1"
        in build.gradle (root project):
          -> change those "mavenCentral()" related things mentioned above in here too!
   * if encountered "google play service update" after syncing and building and running in emulator,
        you should check that the API level and the platform you chose supports Google Play (not Google API)
        (Nexus 5 and 5X platforms supports this) then you can update them inside emulator in its google play
        other than that, there doesn't seem to be any option!
   */
  /**
   * More issues :(
    -> use these versions: (the 4 of them must be using the same version!)
       implementation "com.squareup.okhttp3:okhttp-urlconnection:3.10.0"
       implementation "com.google.android.gms:play-services-maps:12.0.1"
       implementation "com.google.android.gms:play-services-location:12.0.1"
       implementation "com.android.support:support-core-utils:24.1.0"
       implementation "com.google.android.gms:play-services-auth:12.0.1"
       implementation "com.google.android.gms:play-services-identity:12.0.1"
    -> fix the versions as above in "project.properties" in root directory
    -> try running with "ionic cordova run android"
    -> The "PluginMap.java" and "PluginStreetViewPanorama.java" in app/source/main/java/plugin/google/maps
        might come up with idiotic errors! In that case, comment out the error lines (or delete entire file for the latter)
    -> might need to add google-service.json config file
    -> might need to generate signed APK and using debug.keystore (key alias: androiddebugkey, password is generally: android)
   */
  /**
   * Any changes made to the project, must be followed with these steps respectively for building:
    -> run: ionic cordova build android
    -> go to android studio, fix the probable above issues (compile, versions, etc.) and sync and build
    -> run on device or emulator!
    OR JUST
    -> ionic cordova run android (if not the first time and errors are fixed somehow)
   * for iOS, the clientIds and reverse ones must be changed according to the iOS API Key!
   * for first time building, these commands might be needed:
    -> ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=<the_id_in_the_config_file>
    -> ionic cordova platform add android
   */

  /** BUILD FOR PRODUCTION AND RELEASE NOTES
   * Take these steps respectively if you want to release the app:
    - make necessary changes in httpService (Host and assetPrefix)
    - comment @import and add them to index.html (as --prod refuses the former)
    - change Android API Keys to Android Release Keys (2 in packages.json and 2 in config.xml)
    - make sure the webClientId in login component is "Web" Client Id, not Android Client ID!
    - change directory to root ionic app, then:
    - ionic cordova build android --release --prod
    - need a UNIQUE release keystore. suppose you have one with the name 'release.jks' and alias 'androidreleasekey'
    - jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore %USERPROFILE%\.android\release.jks \
        platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk androidreleasekey
    - enter its password (generally it's "android")
    - 'zipalign' and 'apksigner' are found in <path-to-sdk>/build-tools/x.x.x (if not already in system path env vars)
    - zipalign -v 4 app-release-unsigned.apk bankofstyle.apk
    - apksigner verify platforms\android\app\build\outputs\apk\release\bankofstyle.apk
   *  ENJOY!
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
    this.deeplinks.routeWithNavController(this.navChild, {
      '/login/oauth/:activation_link': RegConfirmationPage
    }).subscribe(
      match => {
        let urlParts = match.$link.url.split('/');

        if (urlParts[2] === 'login' && urlParts[3] === 'oauth') {
          this.navChild.push(RegConfirmationPage, {
            activation_link: urlParts[4]
          });
        }
      },
      nomatch => {
        this.toastCtrl.create({
          message: 'خطا در دریافت لینک',
          duration: 5000,
        }).present();
      }
    );
  }
}
