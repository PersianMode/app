import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {RegPreferencesPage} from '../regPreferences/regPreferences';
import {ConfirmationState} from '../../enum/register-status.enum';
import {LoadingService} from '../../services/loadingService';

const expiredLinkStatusCode = 437;

@Component({
  selector: 'page-reg-confirmation',
  templateUrl: 'regConfirmation.html',
})
export class RegConfirmationPage implements OnInit {
  code = null;
  mobile_no = null;
  isGoogleAuth = false;
  username = null;
  gender = null;

  curStatus: ConfirmationState = ConfirmationState.VerificationCode;
  RegStatus = ConfirmationState;

  constructor(private httpService: HttpService, private toastCtrl: ToastController,
              private navCtrl: NavController, private authService: AuthService,
              private navParams: NavParams, private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.mobile_no = this.navParams.get('mobile_no') ? this.navParams.get('mobile_no') : null;
    this.username = this.navParams.get('username') ? this.navParams.get('username') : this.authService.tempData['username'];
    this.gender = this.navParams.get('gender') ? this.navParams.get('gender') : null;
    this.isGoogleAuth = this.navParams.get('isGoogleAuth') ? this.navParams.get('isGoogleAuth') : null;

    // google login
    if (this.isGoogleAuth) {
      if (!this.mobile_no)
        this.curStatus = ConfirmationState.SetMobileNumber;
      else
        this.curStatus = ConfirmationState.VerificationCode;
    }

    // overwrite if there was a dictated (!) state
    if (this.navParams.get('confirmState'))
      this.curStatus = this.navParams.get('confirmState');

    // deep link for email activation
    if (this.navParams.get('activation_link'))
      this.activateLink();

    // Only One Of the above ifs will be true!
  }

  activateLink() {
    this.authService.activateEmail(this.navParams.get('activation_link'))
      .then(res => {
        this.curStatus = ConfirmationState.EmailActivatedSuccessfully;
      })
      .catch(err => {
        if (err && err.status === expiredLinkStatusCode) {
          this.curStatus = ConfirmationState.EmailInvalidOrExpiredActivationLink;
        }
      });
  }

  resendCode() {
    this.httpService.post('register/resend', {username: this.username}).subscribe(
      (data) => {
        this.toastCtrl.create({
          message: 'کد جدید برایتان ارسال شد',
          duration: 2500,
        }).present();
      },
      (err) => {
        console.error('could not resend the code: ', err);
      }
    );
  }

  resendEmailActivationLink() {
    this.loadingService.enable();
    this.httpService.post('user/auth/link', {
      username: this.username,
      is_forgot_mail: false,
    }).subscribe(
      data => {
        this.loadingService.disable();
        this.toastCtrl.create({
          message: 'لینک فعال سازی با موفقیت ارسال شد',
          duration: 3200,
        }).present();
      }, err => {
        this.loadingService.disable();        
        this.toastCtrl.create({
          message: 'خطا در ارسال لینک فعال سازی',
          duration: 2300,
        }).present();
        console.error('error in sending activation code: ', err);
      }
    );
  }

  changeMobileNumber() {
    this.curStatus = ConfirmationState.SetMobileNumber;
    this.code = null;
    this.mobile_no = null;
  }

  checkCode() {
    this.loadingService.enable();
    this.httpService.post('register/verify', {
      username: this.username,
      code: this.code,
    }).subscribe(
      (data) => {
        this.loadingService.disable();
        if (this.isGoogleAuth) {
          this.httpService.get('validUser').subscribe(
            (data) => {
              this.authService.setVerification(true);
              // this.navCtrl.setRoot(TabsPage);
              this.navCtrl.push(RegPreferencesPage, {
                username: this.username,
                gender: this.gender,
                isGoogleAuthConfirmation: true,
              });
            },
            (err) => {
              this.toastCtrl.create({
                message: 'ورود خودکار امکان پذیر نمی باشد. دوباره وارد شوید',
                duration: 3200,
              }).present();
            }
          );
        } else {
          this.tryLoggingIn()
            .catch(err => {
              // correct code but not verified through email
              this.curStatus = this.RegStatus.ActivationLinkPage;
            });
        }
      },
      (err) => {
        this.loadingService.disable();
        console.error('Cannot verify registration: ', err);

        this.toastCtrl.create({
          message: 'کد وارد شده معتبر نمی باشد',
          duration: 3000,
        }).present();
      }
    );
  }

  tryLoggingIn() {
    return new Promise((resolve, reject) => {
      this.authService.login(this.authService.tempData['username'], this.authService.tempData['password'], false)
        .then(res => {
          if (res['is_preferences_set'] === false) {
            this.navCtrl.push(RegPreferencesPage, {
              username: this.username,
              gender: this.gender
            });
          } else {
            // this.navCtrl.setRoot(TabsPage);
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  sendMobileNumber() {
    this.httpService.post('register/mobile', {mobile_no: this.mobile_no}).subscribe(
      (data) => {
        this.toastCtrl.create({
          message: 'کد تأیید ارسال شد',
          duration: 3000,
        }).present();
        this.curStatus = ConfirmationState.VerificationCode;
      },
      (err) => {
        this.toastCtrl.create({
          message: 'قادر به ثبت شماره تلفن همراهتان نیستیم. دوباره نلاش کنید',
          duration: 3200,
        }).present();
        console.error('Cannot apply entered phone number: ', err);
        this.curStatus = ConfirmationState.SetMobileNumber;
      }
    );
  }

  goToLoginPage() {
    this.navCtrl.popToRoot();

    // TODO: if from activation link ->
    // because the root is now this, so popping to root doesn't mean anything!
    // instead we have to set the app.component.ts->rootPage to LoginPage, but how?
    // wait until deeplink functionality implemented, then will think about that!
    if (this.navParams.get('activation_link')) {
    }
  }
}
