import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpService} from './http.service';
import {ToastController} from 'ionic-angular';

@Injectable()
export class OrderService {
  // orderArray: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  orderArray: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  orderData: any;
  constructor(private httpService: HttpService, private toastCtrl: ToastController) {
  }

  getAllOrders() {
    this.httpService.get('orders').subscribe(
      (info) => {
        this.orderArray.next(info.orders);
      },
      (err) => {
        console.error('error');
      }
    );
  }
}
