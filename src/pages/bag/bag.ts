import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {CartService} from "../../services/cart.service";
import {priceFormatter} from "../../shared/lib/priceFormatter";

@Component({
  selector: 'page-bag',
  templateUrl: 'bag.html',
})
export class BagPage implements OnInit {
  products: any[] = [];
  isPromoCodeShown: Boolean = false;
  totalInstanceNumber: number = 0;
  loyalty_point: number = 0;
  balance: number = 0;
  totalCost: number = 0;
  discount: number = 0
  coupon_code = '';
  finalTotal = 0;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
              private cartService: CartService) {
  }

  ionViewWillEnter() {
    this.updateOrderlines();
  }

  ngOnInit() {
    this.cartService.getBalanceAndLoyalty((b, l) => {
      this.balance = b;
      this.loyalty_point = l;
    });
  }

  onClickedOnPromoCode() {
    this.isPromoCodeShown = !this.isPromoCodeShown;
  }

  computeTotalCost() {
    this.totalCost = 0;
    this.discount = 0;
    this.totalInstanceNumber = 0;

    this.products.forEach(e => {
      const price = e.final_cost ? e.final_cost : e.cost;

      // Compute total cost
      this.totalCost += price * (e.quantity ? e.quantity : 1);

      // Compute total discount
      this.discount += (price - (e.discount.reduce((a, b) => a * b) * price)) * e.quantity;
    });

    this.finalTotal = this.totalCost - this.discount;
  }

  updateOrderlines($event = null) {
    this.cartService.loadOrderlines(() => {
      let t = this.cartService.getReformedOrderlines();
      this.products = t || [];
      this.computeTotalCost();
    });
  }

  formatPrice(p) {
    return priceFormatter(p);
  }

  applyCoupon() {
    this.cartService.addCoupon(this.coupon_code)
      .then((res: number) => {
        if (res) {
          this.discount += res;
          this.finalTotal = this.totalCost - this.discount;
        }
      })
      .catch(err => {
        console.error('rejected: ', err);
      });
  }
}
