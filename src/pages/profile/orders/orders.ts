import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {AuthService} from '../../../services/auth.service';
import {HttpService} from '../../../services/http.service';
import {OrderService} from '../../../services/order.service';
import {OrderLinesPage} from '../order-lines/order-lines';
import {dateFormatter} from '../../../shared/lib/dateFormatter';
import {makePersianNumber} from '../../../shared/lib/makePersianNumber';

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
  orderArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, private httpService: HttpService,
              private orderService: OrderService) {
  }

  ngOnInit() {
    this.orderService.orderArray.subscribe(result => {
      if (!result.length)
        return;
      this.orderArray = result;
      this.orderArray.forEach(el => [el.jalali_date, el.time] = dateFormatter(el.order_time));
    });

    this.orderService.getAllOrders();

  }

  ionViewDidLoad() {
    this.orderService.getAllOrders();
  }

  ionViewWillEnter() {
    this.orderService.orderArray.subscribe(result => {
      if (!result.length)
        return;
      this.orderArray = result;
      this.orderArray.forEach(el => [el.jalali_date, el.time] = dateFormatter(el.order_time));
    });

    this.orderService.getAllOrders();
    this.viewCtrl.setBackButtonText('بازگشت');
  }

  makePersianNumber(a: string, isPrice) {
    return makePersianNumber(a, isPrice);
  }

  goToOrderLinesPage(orderId) {
    this.orderService.orderData = {
      orderId: orderId,
      dialog_order: this.orderArray.find(el => el._id === orderId),
    };
    this.navCtrl.push(OrderLinesPage);
  }
}
