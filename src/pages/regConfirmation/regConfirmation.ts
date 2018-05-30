import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {NavController, ToastController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {AuthService} from "../../services/auth.service";
import {RegPreferencesPage} from '../regPreferences/regPreferences';

@Component({
  selector: 'page-reg-confirmation',
  templateUrl: 'regConfirmation.html',
})
export class RegConfirmationPage implements OnInit {
  code = null;
  mobile_no = null;
  shouldEnterMobileNumber = false;
  isGoogleAuth = false;
  username = null;
  gender = null;

  constructor(private httpService: HttpService, private toastCtrl: ToastController,
    private navCtrl: NavController, private authService: AuthService,
    private navParams: NavParams) {
  }

  ngOnInit() {
    this.mobile_no = this.navParams.get('mobile_no') ? this.navParams.get('mobile_no') : null;
    this.username = this.navParams.get('username') ? this.navParams.get('username') : this.authService.tempData.username;
    this.gender = this.navParams.get('gender') ? this.navParams.get('gender') :  null;
    this.isGoogleAuth = this.navParams.get('isGoogleAuth') ? this.navParams.get('isGoogleAuth') : null;
    this.shouldEnterMobileNumber = !this.mobile_no;
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

      }
    )
  }

  changeMobileNumber() {
    this.shouldEnterMobileNumber = true;
    this.code = null;
    this.mobile_no = null;
  }

  checkCode() {
    this.httpService.post('register/verify', {
      code: this.code,
      username: this.username,
    }).subscribe(
      (data) => {
        if (this.isGoogleAuth) {
          this.httpService.get('validUser').subscribe(
            (data) => {
              this.authService.setVerification(true);
              // this.navCtrl.setRoot(TabsPage);
              this.navCtrl.push(RegPreferencesPage, {
                username: this.username,
                gender: this.gender
              });
            },
            (err) => {
              this.toastCtrl.create({
                message: 'ورود خودکار امکان پذیر نمی باشد. دوباره وارد شوید',
                duration: 3200,
              }).present();
            }
          )
        } else {
          this.authService.login(this.authService.tempData.username, this.authService.tempData.password, false)
            .then(res => {
              // this.navCtrl.setRoot(TabsPage);
              this.navCtrl.push(RegPreferencesPage, {
                username: this.username,
                gender: this.gender
              });
            })
            .catch(err => {
              console.error('Cannot login: ', err);
              this.toastCtrl.create({
                message: 'قادر به وارد شدن به سیستم نیستید. دوباره تلاش کنید',
                duration: 3000,
              }).present();
            })
        }
      },
      (err) => {
        console.error('Cannot verify registration: ', err);

        this.toastCtrl.create({
          message: 'کد وارد شده معتبر نمی باشد',
          duration: 3000,
        }).present();
      }
    );
  }
  sendMobileNumber() {
    // return this.shouldEnterMobileNumber = false;
    this.httpService.post('register/mobile', {
      username: this.username,
      mobile_no: this.mobile_no,
    }).subscribe(
      (data) => {
        this.toastCtrl.create({
          message: 'کد تأیید ارسال شد',
          duration: 3000,
        }).present();

        this.shouldEnterMobileNumber = false;
      },
      (err) => {
        this.toastCtrl.create({
          message: 'قادر به ثبت شماره تلفن همراهتان نیستیم. دوباره نلاش کنید',
          duration: 3200,
        }).present();
        this.shouldEnterMobileNumber = true;

        console.error('Cannot apply entered phone number: ', err);
      }
    );
  }
}
