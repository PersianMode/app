import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment-jalaali';
import * as mom from 'moment';
import {HttpService} from '../../services/http.service';
import {AuthService} from '../../services/auth.service';
import {NavController, ToastController} from 'ionic-angular';
import {RegConfirmationPage} from '../regConfirmation/regConfirmation';
import 'moment/locale/fa';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
  ,
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  curFocus = null;
  seen : any = {};
  gender = null;
  dob = null;
  dateObject = null;



  constructor(private httpService: HttpService, private authService: AuthService,
              public navCtrl: NavController, private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.dateObject = moment(new Date()).format('jYYYY,jMM,jDD');
    this.initForm();
  }


  initForm() {
    this.registerForm = new FormBuilder().group({
      username: [null, [
        Validators.required,
        Validators.email,
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
      ]],
      first_name: [null, [
        Validators.required,
      ]],
      surname: [null, [
        Validators.required,
      ]],
      dob: [null, [
        Validators.required,
      ]],
      mobile_no: [null, [
        Validators.required,
        Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
      ]],
    });
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  register() {
    if (this.registerForm.valid && this.gender) {
      let data :any = {};
      Object.keys(this.registerForm.controls).forEach(el => data[el] = this.registerForm.controls[el].value);
      data.dob = this.dob;
      data['gender'] = this.gender;

      this.httpService.put('register', data).subscribe(
        (res) => {
          this.authService.tempData = {
            username: this.registerForm.controls['username'].value,
            password: this.registerForm.controls['password'].value,
          };
          this.navCtrl.push(RegConfirmationPage);
        },
        (err) => {
          console.error('Cannot register: ', err);

          if (err.error === 'Username or mobile number is exist')
            this.toastCtrl.create({
              message: 'نام کاربری و یا موبایل در سیستم موجود می باشد',
              duration: 3000,
            }).present();
          else
            this.toastCtrl.create({
              message: 'در حال حاضر قادر به ثبت نام شما نیستیم. دوباره تلاش کنید',
              duration: 3000,
            }).present();
        }
      );
    } else {
      Object.keys(this.registerForm.controls).forEach(el => {
        if (!this.registerForm.controls[el].valid) {
          this.seen[el] = true;
        }
      });

      if (!this.gender) {
        this.seen['gender'] = true;
      }
    }
  }

  googleRegister() {
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

  setGender(g) {
    this.gender = g;
    this.seen['gender'] = true;
  }

  changeDob(date) {
    console.log('date : ', date);
    this.dob = date;
    this.registerForm.controls['dob'].setValue(date);
    this.seen.dob = true;
    this.curFocus = 'dob';
  }
}
