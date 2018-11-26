import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {AuthService} from '../../../services/auth.service';
import {HttpService} from '../../../services/http.service';
import {OrderService} from '../../../services/order.service';
import * as moment from 'jalali-moment';
import {OrderLinesPage} from '../order-lines/order-lines';

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage implements OnInit {
  orderArray: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, private httpService: HttpService,
              private orderService: OrderService) {
  }

  ngOnInit() {
    this.orderArray = this.orderService.orderArray;
    this.orderArray.forEach(el => [el.jalali_date, el.time] = this.dateFormatter(el.order_time));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('بازگشت');
  }

  dateFormatter(d) {
    const date = moment(d);
    if (date.isValid())
      return [
        [date.jDate(), date.jMonth() + 1, date.jYear()].map(r => r.toLocaleString('fa', {useGrouping: false})).join(' / '),
        [date.hour(), date.minute(), date.second()].map(r => (r < 10 ? '۰' : '') + r.toLocaleString('fa', {useGrouping: false})).join(':')
      ];
    else return ['', ''];
  }


  makePersianNumber(a: string, isPrice) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: isPrice});
  }

  goToOrderLinesPage(orderId) {
    this.orderService.orderData = {
      orderId: orderId,
      dialog_order: this.orderArray.find(el => el._id === orderId),
    };
    this.navCtrl.push(OrderLinesPage);
  }

}
