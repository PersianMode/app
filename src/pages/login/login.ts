import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegisterPage} from '../register/register';
import {AuthService} from '../../services/auth.service';
import {TabsPage} from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit{
  loginForm: FormGroup;
  seen = {};
  curFocus = null;

  constructor(private navCtrl: NavController, private authService: AuthService,
              private toastCtrl: ToastController) {}

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

  login(){
    if(!this.loginForm.valid)
      return;

    this.authService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
      .then(() => {
        this.navCtrl.setRoot(TabsPage);
      })
      .catch(err => {
        console.error('Cannot login: ', err);
        this.toastCtrl.create({
          message: 'سیستم قادر به ورود شما نیست. دوباره تلاش کنید',
          duration: 3200,
        }).present();
      });
  }

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }
}
