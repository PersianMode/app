import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {IPageInfo} from '../interfaces/ipageInfo.interface';
import {HttpService} from './http.service';
import {ToastController} from 'ionic-angular';

@Injectable()
export class OrderService {
  // orderArray: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  orderArray: any = [];
  orderData: any;
  constructor(private httpService: HttpService, private toastCtrl: ToastController) {
  }

  getAllOrders() {
    this.httpService.get('orders').subscribe(
      (info) => {
        this.orderArray = info.orders;
      },
      (err) => {
        console.error('error');
      }
    );
  }
}