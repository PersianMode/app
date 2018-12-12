import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {OrderService} from '../../../services/order.service';
import {OrderLinesPage} from '../order-lines/order-lines';
import {dateFormatter} from '../../../shared/lib/dateFormatter';
import {makePersianNumber} from '../../../shared/lib/makePersianNumber';

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage implements OnInit {
  orderArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, private orderService: OrderService) {
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
