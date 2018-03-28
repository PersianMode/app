import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {CartService} from "../../services/cart.service";
import {priceFormatter} from "../../shared/lib/priceFormatter";

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

  totalInstanceNumber: number = 0;

  loyalty_point: number = 0;
  balance: number = 0;
  totalCost: number = 0;
  coupon_code = '';

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
              private cartService: CartService) {
  }

  ionViewWillEnter() {
    console.log("hey!");
    this.updateOrderlines();
    // console.log("are you here?!");
  }

  onClickedOnPromoCode() {
    this.isPromoCodeShown = !this.isPromoCodeShown;
  }

  computeTotalCost() {
    this.totalCost = 0;
    this.totalInstanceNumber = 0;
    this.products.forEach(e => this.totalCost += (e.final_cost ? e.final_cost : e.cost) * (e.quantity ? e.quantity : 1));

    //wondering if this should be here or another function
    this.cartService.getBalanceAndLoyalty((b, l) => {
      this.balance = b;
      this.loyalty_point = l;
    });
  }

  updateOrderlines($event = null) {
    // console.log("came here!");
    this.cartService.loadOrderlines(() => {
      let t = this.cartService.getReformedOrderlines();
      // if (!t)
      //   this.products = null;
      // else
      this.products = t || [];
      this.computeTotalCost();
      console.log("products have become:", this.products);
    });
    // console.log("products afterwards", this.products);
  }

  formatPrice(p) {
    return priceFormatter(p);
  }

  applyCoupon() {
    this.cartService.addCoupon(this.coupon_code)
      .then(res => {

      })
      .catch(err => {

      });
  }
}
