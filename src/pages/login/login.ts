import {Component, OnInit} from '@angular/core';
import {NavController, ToastController, LoadingController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {RegisterPage} from '../register/register';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {GooglePlus} from '@ionic-native/google-plus';
import {RegConfirmationPage} from '../regConfirmation/regConfirmation';
import {ForgotPasswordPage} from '../forgot-password/forgot-password';
import {RegPreferencesPage} from '../regPreferences/regPreferences';
import {ConfirmationState} from '../../enum/register-status.enum';

// declare var window: any;
export const VerificationErrors = {
  notVerified: {
    status: 420,
    error: 'Customer is not verified yet',
  },
  notMobileVerified: {
    status: 421,
    error: 'Customer\'s mobile is not verified yet',
  },
  notEmailVerified: {
    status: 422,
    error: 'Customer\'s email is not verified yet',
  },
};
const bothVerifiedCode = 3;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  seen = {};
  curFocus = null;

  // dR = '';
  // mess = '';

  constructor(private navCtrl: NavController, private authService: AuthService,
              private toastCtrl: ToastController, private httpService: HttpService,
              private googlePlus: GooglePlus, private loadingCtrl: LoadingController) {

  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormBuilder().group({
      username: [null, [
        Validators.required,
      ]],
      password: [null, [
        Validators.required,
      ]],
    }, {
      validator: this.checkUsername,
    });
  }

  checkUsername(AC: AbstractControl) {
    const username = AC.get('username').value;
    let isMatched = false;
    if (username) {
      if (username.includes('@')) {
        isMatched = (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(username);
      } else {
        isMatched = (/^[\u0660-\u06690-9\u06F0-\u06F9]+$/).test(username);
      }
    }

    if (!isMatched) {
      AC.get('username').setErrors({match: 'not matched to any type'});
    } else {
      AC.get('username').setErrors(null);
      return null;
    }
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  login() {
    if (!this.loginForm.valid)
      return;

    const waiting = this.loadingCtrl.create({
      content: 'لطفا صبر کنید ...'
    });
    waiting.present();

    this.authService.tempData = {
      username: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['password'].value,
      gender: 'm',
    };

    this.authService.login(this.authService.tempData['username'], this.authService.tempData['password'])
      .then((res) => {
        waiting.dismiss();

        if (res['is_preferences_set'] === false) {
          this.navCtrl.push(RegPreferencesPage, {
            username: this.authService.tempData['username'],
            gender: res['gender'] || 'm',
          });
        } else {
          // this.navCtrl.setRoot(TabsPage); -> automatically does that! so smart, isn't it?
        }
      })
      .catch(err => {
        waiting.dismiss();

        // either wrong credential or an unverified thing
        let confirmState: ConfirmationState;
        switch (err.status) {
          case VerificationErrors.notVerified.status:
          case VerificationErrors.notMobileVerified.status:
            confirmState = ConfirmationState.VerificationCode;
            break;
          case VerificationErrors.notEmailVerified.status:
            confirmState = ConfirmationState.ActivationLinkPage;
            break;
          default:
            console.error('cannot login: ', err);
            this.toastCtrl.create({
              message: 'نام کاربری یا رمز عبور صحیح نیست',
              duration: 3200,
            }).present();
            return;
        }

        this.navCtrl.push(RegConfirmationPage, {confirmState});
      });
  }

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

  googleLogin() {
    this.googlePlus.login({
      // 'webClientId': '986035602689-905fo138kc6jct8loqgi1j2q1g9ogd2l.apps.googleusercontent.com',
      // 'offline': true
    }).then(res => {
      // ->
      // this.dR = 'googling -> ';
      // <-
      this.httpService.post('login/google/app', res).subscribe(
        (data) => {
          //->
          // this.dR += 'done';
          // this.mess = JSON.stringify(data);
          //<-
          this.authService.afterLogin(data).then(ans => {
            if (data.mobile_no && data.is_verified === bothVerifiedCode) {
              this.authService.isFullAuthenticated.next(true);
            } else { // if verification conditions weren't met
              this.navCtrl.push(RegConfirmationPage, {
                isGoogleAuth: true,
                username: data.username,
                mobile_no: data.mobile_no || null,
              });
            }
          });
        },
        (err) => {
          //->
          // this.dR += 'not done';
          // this.mess = JSON.stringify(err);
          //<-
          console.error('Internal server error occurred: ', err);
        }
      );
    }).catch(err => {
      //->
      // this.dR = 'in catch!';
      // this.mess = JSON.stringify(err);
      //<-
      console.error('Cannot login via google: ', err);
    });
  }

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }
}
