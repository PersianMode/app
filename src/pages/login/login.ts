import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegisterPage} from '../register/register';
import {AuthService} from '../../services/auth.service';
import {TabsPage} from '../tabs/tabs';
import {HttpService} from '../../services/http.service';
import {GooglePlus} from '@ionic-native/google-plus';
import {RegConfirmationPage} from '../regConfirmation/regConfirmation';
import {ForgotPasswordPage} from '../forgot-password/forgot-password';

// declare var window: any;

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
    private googlePlus: GooglePlus) {

  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormBuilder().group({
      email: [null, [
        Validators.required,
        Validators.email,
      ]],
      password: [null, [
        Validators.required,
      ]],
    });
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  login() {
    this.dR = 'pressed';
    if (!this.loginForm.valid)
      return;

    this.authService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
      .then(() => {
        this.navCtrl.setRoot(TabsPage);
      })
      .catch(err => {
        console.error('Cannot login: ', err);
        this.toastCtrl.create({
          message: 'نام کاربری یا رمز عبور صحیح نیست',
          duration: 3200,
        }).present();
      });
  }

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

  googleLogin() {
    // The login/google/app uses mock data
    // The data to pass to server must received from googleplus authentication
    this.httpService.post('login/google/app', {
      accessToken: 'ya29.GlupBRcq4V9UCJj5RK4VJxtzM-Uy0ZRXY-j_FEHXaOMXICZqG2fxSMKIPvNKv3-vCqFuYu16gXye6yg6Trlg6dT-Lso0QFOt27MslbBXpqodWDJtNyFtRnA9g5fO',
      expires: 1524754249,
      expires_in: 3589,
      email: 'ali.71hariri@gmail.com',
      idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFmZmM2MjkwN2E0NDYxODJhZGMxZmE0ZTgxZmRiYTYzMTBkY2U2M2YifQ.eyJhenAiOiI4NTU4NDI1NjgyNDUtb2Q2a3JxcWFwcmdqcDZramc4Y21qYXNvdnJvYmhiOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NTU4NDI1NjgyNDUtYzBxOHNtMDkwY3BkMzc3ZW0xazBoZ3J0cGhkZ2R2YzkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE0NzgyNzY2MjUwNzYxNDgxNzkiLCJlbWFpbCI6ImFsaS43MWhhcmlyaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNTI0NzU0MjU4LCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE1MjQ3NTA2NTgsIm5hbWUiOiJBbGlyZXphIEhhcmlyaSIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLW8wNTcyNTY1NW00L0FBQUFBQUFBQUFJL0FBQUFBQUFBQVlNL2RJbW1qR3dCSVVrL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJBbGlyZXphIiwiZmFtaWx5X25hbWUiOiJIYXJpcmkiLCJsb2NhbGUiOiJlbiJ9.cMCIvxL9qaMbA-PJ66jOys23nimOgtFEuKbVzPpBK8ZCmgKOA9OuYOQaoIY3JfosUjwYNiADoRw6-RrbSn8dUOPamq1fA6EM8HS4r-sUdXy9XDui0hAXfnir7NCU6EDoDpb3ABMxItZ1X7RydlMH6QjUP2b_B1R7uwIpSF-bMMao4N_sUj7pUlLX8mUPum5dxBJUopH4IChWuLBaNsKf3eWt49F8mtO6HGgfoXcCQd1CxDq_4NUjKvNpXpW3p-ctABJtitEHeZgNmfX6RtilRpT0127q4LCUyQPf-ag8ANwjsBIxqioT9tUzo5XE7I2gUeg4gNkabdHPNgmVM7AP4g',
      serverAuthCode: '4/AAA0lcOKlhTy3c2_tYK8HKEpNNkFXIWrxGj4-4rmqFC9BaRZuhOCBpGYBKePLHnARVm-EKwRkrTmbhz0rcUwi9Y',
      userId: '111478276625076148179',
      displayName: 'Alireza Hariri',
      familyName: 'Hariri',
      givenName: 'Alireza',
      imageUrl: 'https://lh4.googleusercontent.com/-o05725655m4/AAAAAAAAAAI/AAAAAAAAAYM/dImmjGwBIUk/s96-c/photo.jpg'
    }).subscribe(
      (data) => {
        this.authService.afterLogin(data)
        this.navCtrl.push(RegConfirmationPage, {isGoogleAuth: true, username: data.username});
      },
      (err) => {
        console.error('Cannot login via google: ', err);
      }
    );

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
