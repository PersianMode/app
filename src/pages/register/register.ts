import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  curFocus = null;
  seen = {};

  constructor() {

  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = new FormBuilder().group({
      email: [null, [
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
    });
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  register() {

  }

  googleRegister() {

  }
}
