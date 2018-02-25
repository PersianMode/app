import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {NavController, ToastController} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'page-reg-confirmation',
  templateUrl: 'regConfirmation.html',
})
export class RegConfirmationPage implements OnInit {
  code = null;

  constructor(private httpService: HttpService, private toastCtrl: ToastController,
              private navCtrl: NavController, private authService: AuthService) {
  }

  ngOnInit() {

  }

  resendCode() {
    this.httpService.post('register/resend', {username: this.authService.tempData.username}).subscribe(
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

  back() {
    this.navCtrl.pop();
  }

  checkCode() {
    this.httpService.post('register/verify', {
      code: this.code,
      username: this.authService.tempData.username,
    }).subscribe(
      (data) => {
        this.authService.login(this.authService.tempData.username, this.authService.tempData.password)
          .then(res => {
            this.navCtrl.setRoot(TabsPage);
          })
          .catch(err => {
            console.error('Cannot login: ', err);
            this.toastCtrl.create({
              message: 'قادر به وارد شدن به سیستم نیستید. دوباره تلاش کنید',
              duration: 3000,
            }).present();
          })
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
}
