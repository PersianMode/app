import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ToastController} from 'ionic-angular';

@Component({
  selector: 'page-reg-confirmation',
  templateUrl: 'regConfirmation.html',
})
export class RegConfirmationPage implements OnInit {
  code = null;

  constructor(private httpService: HttpService, private toastCtrl: ToastController) {
  }

  ngOnInit() {

  }
}
