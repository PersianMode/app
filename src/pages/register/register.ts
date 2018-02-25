import {Component, OnInit} from '@angular/core';
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
  seen = {};
  years = [];
  months = [
    {name: 'فروردین', value: 1},
    {name: 'اردیبهشت', value: 2},
    {name: 'خرداد', value: 3},
    {name: 'تیر', value: 4},
    {name: 'مرداد', value: 5},
    {name: 'شهریور', value: 6},
    {name: 'مهر', value: 7},
    {name: 'آبان', value: 8},
    {name: 'آذر', value: 9},
    {name: 'دی', value: 10},
    {name: 'بهمن', value: 11},
    {name: 'اسفند', value: 12}
  ];
  gender = null;
  days = [];

  constructor(private httpService: HttpService, private authService: AuthService,
              public navCtrl: NavController, private toastCtrl: ToastController) {
  }

  ngOnInit() {
    moment.locale('fa');
    mom.locale('en');
    for (let y = 0; y < 100; y++) {
      this.years.push({
        name: moment(new Date()).subtract(y, 'Y').format('jYYYY'),
        value: mom(new Date()).subtract(y, 'years').format('YYYY')
      });
    }

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
      birthDay: [null, [
        Validators.required,
      ]],
      birthMonth: [null, [
        Validators.required,
      ]],
      birthYear: [mom(new Date()).subtract(25, 'years').format('YYYY'), [
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
      let data = {};
      Object.keys(this.registerForm.controls).forEach(el => data[el] = this.registerForm.controls[el].value);
      mom.locale('en');
      data['dob'] = mom(new Date(
        this.registerForm.controls['birthYear'].value,
        this.registerForm.controls['birthMonth'].value - 1,
        this.registerForm.controls['birthDay'].value
      )).format('YYYY-MM-DD');
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

  }

  monthChanged() {
    this.days = [];

    for (let d = 1; d <= 29; d++)
      this.days.push(d);

    if (this.registerForm.controls['birthMonth'].value <= 6)
      this.days = this.days.concat([30, 31]);
    else if (this.registerForm.controls['birthMonth'].value <= 11)
      this.days = this.days.concat([30]);
    else if ((this.registerForm.controls['birthYear'].value - 1383) % 4 === 0)
      this.days = this.days.concat([30]);

    if (this.days.indexOf(this.registerForm.controls['birthDay'].value) === -1)
      this.registerForm.controls['birthDay'].setValue(null);
  }

  setGender(g) {
    this.gender = g;
    this.seen['gender'] = true;
  }
}
