import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, ToastController, Navbar} from 'ionic-angular';
import {HttpService} from '../../services/http.service';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  isFirstStage: boolean = true;
  mobile_no = null;
  chPassForm: FormGroup;
  seen = {};
  curFocus = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private httpService: HttpService, private toastCtrl: ToastController) {
  }

  ionViewWillEnter() {
    this.navBar.setBackButtonText("بازگشت");
  }

  ngOnInit() {
    this.initPassForm();
  }

  initPassForm() {
    this.chPassForm = new FormBuilder().group({
      code: [null, [
        Validators.required,
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
      ]],
      re_password: [null, [
        Validators.required,
      ]]
    }, {
      validator: this.matchPassword,
    });
  }

  private matchPassword(AC: AbstractControl) {
    const password = AC.get('password').value;
    const confirmPassword = AC.get('re_password').value;
    if (password !== confirmPassword) {
      AC.get('re_password').setErrors({matchPassword: true});
    } else {
      AC.get('re_password').setErrors(null);
      return null;
    }
  }

  applyCode() {
    if (!this.mobile_no)
      return;

    this.httpService.post('forgot/password', {
      mobile_no: this.mobile_no,
    }).subscribe(
      (data) => {
        this.isFirstStage = false;
        this.toastCtrl.create({
          message: 'کد ارسال شد',
          duration: 2300,
        }).present();
      },
      (err) => {
        console.error('err: ', err);

        this.toastCtrl.create({
          message: err.status === 404 ? 'شماره وارد شده در سیستم یافت نشد' : 'قادر به ارسال کد نیستیم. دوباره تلاش کنید',
          duration: 3200,
        }).present();
      });
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  changePassword() {
    if (!this.chPassForm.valid)
      return;

    this.httpService.post('forgot/set/password', {
      mobile_no: this.mobile_no,
      code: this.chPassForm.controls['code'].value,
      password: this.chPassForm.controls['password'].value,
    }).subscribe(
      (data) => {
        this.toastCtrl.create({
          message: 'رمز عبور به روزرسانی شد',
          duration: 2300,
        }).present();
        this.navCtrl.pop();
      },
      (err) => {
        this.toastCtrl.create({
          message: 'از درست بودن کد و رمز عبور اطمینان حاصل نمایید',
          duration: 3200,
        }).present();
      });
  }
}
