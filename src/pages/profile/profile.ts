import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {ProductDetailPage} from '../products/product-detail/product-detail';
import {OrdersPage} from './orders/orders';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
  user = null;

  constructor(public navCtrl: NavController, private authService: AuthService,
              private orderService: OrderService) {

  }

  ngOnInit() {
    this.user = this.authService.userData;
    if (this.user && !this.user.imgUrl)
      this.user.imgUrl = 'assets/imgs/default-user.png';

    this.user.fullName = this.getFullName();
    this.orderService.getAllOrders();
  }

  getFullName() {
    return (
      (this.user.name ? this.user.name : '') +
      (this.user.name && this.user.surname ? ' ' : '') +
      (this.user.surname ? this.user.surname : '')
    );
  }

  logout() {
    this.authService.logout();
  }

  goToOrderPage() {
    this.navCtrl.push(OrdersPage);
  }

}
