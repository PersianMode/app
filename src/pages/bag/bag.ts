import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {CartService} from "../../services/cart.service";


@Component({
  selector: 'page-bag',
  templateUrl: 'bag.html',
})
export class BagPage {
  products: any[] = [{
    name: 'محصول ۱',
    cost: 1000,
    product_color_id: '5a9cf71a68b68c2897d19253',
    thumbnail: 'assets/product-pic/13.jpg',
    color: "سفید زرد آبی",
    size: 'M 14 / W 15.5',

  }, {
    name: 'محصول ۱',
    cost: 1500,
    product_color_id: '5a9cf71a68b68c2897d1924f',
    thumbnail: 'assets/product-pic/12.jpg',
    color: "سفید زرد آبی",
    size: "M 14 / W 15.5",
  }, {
    name: 'محصول ۲',
    cost: 2000,
    product_color_id: '5a9cf71a68b68c2897d19251',
    thumbnail: 'assets/product-pic/11.jpg',
    color: 'سفید زرد آبی',
    size: 'M 14 / W 15.5',
  }, {
    name: 'محصول ۳',
    cost: 3000,
    product_color_id: '5a9cf71a68b68c2897d19252',
    thumbnail: 'assets/product-pic/10.jpg',
    color: 'سفید زرد آبی',
    size: 'M 14 / W 15.5',
  }];
  isPromoCodeShown: Boolean = false;
  shippingCost: number = 0;
  estimatedTax: number = 0;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
              private cartService: CartService) {
  }

  ionViewWillEnter() {
    this.cartService.loadOrderlines();
    this.products = this.cartService.getReformedOrderlines();
  }


  onClickedOnPromoCode() {
    this.isPromoCodeShown = !this.isPromoCodeShown;
  }

  getSubtotalCost() {
    let cost = 0;
    for (let p in this.products) {
      cost += this.products[p].cost;
    }
    return cost;
  }

  getTotalCost() {
    let cost = this.getSubtotalCost();
    cost += this.shippingCost + this.estimatedTax;
    return cost;
  }

}
