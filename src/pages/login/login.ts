import {Component, OnInit} from '@angular/core';
import {NavController, ToastController, LoadingController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {RegisterPage} from '../register/register';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {GooglePlus} from '@ionic-native/google-plus';
import {ConfirmationState, RegConfirmationPage} from '../regConfirmation/regConfirmation';
import {ForgotPasswordPage} from '../forgot-password/forgot-password';
import {RegPreferencesPage} from '../regPreferences/regPreferences';

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

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  seen = {};
  curFocus = null;

  dR = '';
  mess = '';

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
        console.log('res in login auth: ', res);

        if (res['is_preferences_set'] === false) {
          this.navCtrl.push(RegPreferencesPage, {
            username: this.authService.tempData['username'],
            gender: res['gender'] || 'm',
          });
        } else {
          // this.navCtrl.push(TabsPage); -> automatically does that! so smart, isn't it?
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
    // The login/google/app uses mock data
    // The data to pass to server must be received from googleplus authentication

    // this.httpService.post('login/google/app', {
    //   accessToken: 'ya29.GlupBRcq4V9UCJj5RK4VJxtzM-Uy0ZRXY-j_FEHXaOMXICZqG2fxSMKIPvNKv3-vCqFuYu16gXye6yg6Trlg6dT-Lso0QFOt27MslbBXpqodWDJtNyFtRnA9g5fO',
    //   expires: 1524754249,
    //   expires_in: 3589,
    //   email: 'ali.71hariri@gmail.com',
    //   idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFmZmM2MjkwN2E0NDYxODJhZGMxZmE0ZTgxZmRiYTYzMTBkY2U2M2YifQ.eyJhenAiOiI4NTU4NDI1NjgyNDUtb2Q2a3JxcWFwcmdqcDZramc4Y21qYXNvdnJvYmhiOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NTU4NDI1NjgyNDUtYzBxOHNtMDkwY3BkMzc3ZW0xazBoZ3J0cGhkZ2R2YzkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE0NzgyNzY2MjUwNzYxNDgxNzkiLCJlbWFpbCI6ImFsaS43MWhhcmlyaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNTI0NzU0MjU4LCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE1MjQ3NTA2NTgsIm5hbWUiOiJBbGlyZXphIEhhcmlyaSIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLW8wNTcyNTY1NW00L0FBQUFBQUFBQUFJL0FBQUFBQUFBQVlNL2RJbW1qR3dCSVVrL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJBbGlyZXphIiwiZmFtaWx5X25hbWUiOiJIYXJpcmkiLCJsb2NhbGUiOiJlbiJ9.cMCIvxL9qaMbA-PJ66jOys23nimOgtFEuKbVzPpBK8ZCmgKOA9OuYOQaoIY3JfosUjwYNiADoRw6-RrbSn8dUOPamq1fA6EM8HS4r-sUdXy9XDui0hAXfnir7NCU6EDoDpb3ABMxItZ1X7RydlMH6QjUP2b_B1R7uwIpSF-bMMao4N_sUj7pUlLX8mUPum5dxBJUopH4IChWuLBaNsKf3eWt49F8mtO6HGgfoXcCQd1CxDq_4NUjKvNpXpW3p-ctABJtitEHeZgNmfX6RtilRpT0127q4LCUyQPf-ag8ANwjsBIxqioT9tUzo5XE7I2gUeg4gNkabdHPNgmVM7AP4g',
    //   serverAuthCode: '4/AAA0lcOKlhTy3c2_tYK8HKEpNNkFXIWrxGj4-4rmqFC9BaRZuhOCBpGYBKePLHnARVm-EKwRkrTmbhz0rcUwi9Y',
    //   userId: '111478276625076148179',
    //   displayName: 'Alireza Hariri',
    //   familyName: 'Hariri',
    //   givenName: 'Alireza',
    //   imageUrl: 'https://lh4.googleusercontent.com/-o05725655m4/AAAAAAAAAAI/AAAAAAAAAYM/dImmjGwBIUk/s96-c/photo.jpg'
    // }).subscribe(
    //   (data) => {
    //     this.authService.afterLogin(data)
    //     this.navCtrl.push(RegConfirmationPage, {isGoogleAuth: true, username: data.username});
    //   },
    //   (err) => {
    //     console.error('Cannot login via google: ', err);
    //   }
    // );

    this.toastCtrl.create({message: 'اینجا!', duration: 500}).present();
    this.googlePlus.login({
      'webClientId': '855842568245-c0q8sm090cpd377em1k0hgrtphdgdvc9.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      // ->
      this.dR = 'googling :D';
      // <-
      this.toastCtrl.create({message: 'on G+ login' + res.email, duration: 3000}).present();
      this.httpService.post('login/google/app', res).subscribe(
        (data) => {
          //->
          this.dR = 'done';
          this.mess = JSON.stringify(data);
          //<-
          this.toastCtrl.create({message: 'posted data!', duration: 3000}).present();
          this.authService.afterLogin(data).then(ans => {
            this.navCtrl.push(RegConfirmationPage, {isGoogleAuth: true, username: data.username});
          });
        },
        (err) => {
          //->
          this.dR = 'not done';
          this.mess = JSON.stringify(err);
          //<-
          console.error('Internal server error occurred: ', err);
        }
      );
    }).catch(err => {
      //->
      this.dR = 'in catch!';
      this.mess = JSON.stringify(err);
      //<-
      console.error('Cannot login via google: ', err);
    });

    // this.googlePlus.login({
    //   'webClientId': '636231560622-hr7vctis0fsihrf8gomv1seug37tl695.apps.googleusercontent.com',
    //   'offline': true
    // }).then(res => {
    //   this.dR = 'googling :D';
    //   this.httpService.post('login/google/app', {'res': res}).subscribe(
    //     data => {
    //       this.dR = 'done';
    //       this.mess = JSON.stringify(data);
    //     }, err => {
    //       this.dR = 'res but not done!';
    //       this.mess = JSON.stringify(err);
    //     }
    //   );
    // })
    //   .catch(rej => {
    //     this.httpService.post('login/google/app', {'err': rej}).subscribe(
    //       data => {
    //         this.dR = 'not done';
    //         this.mess = JSON.stringify(data);
    //       }, err => {
    //         this.dR = 'neither res nor done!';
    //         this.mess = JSON.stringify(err);
    //       }
    //     );
    //   });
  }

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }
}
