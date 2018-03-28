import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {CartService} from "../../services/cart.service";
import {priceFormatter} from "../../shared/lib/priceFormatter";

@Component({
  selector: 'page-bag',
  templateUrl: 'bag.html',
})
export class BagPage implements OnInit {
  products: any[] = [];
  cartItemsLength: number = 0;
  isPromoCodeShown: Boolean = false;
  totalInstanceNumber: number = 0;
  loyalty_point: number = 0;
  balance: number = 0;
  totalCost: number = 0;
  discount: number = 0;
  coupon_code = '';
  finalTotal = 0;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              private cartService: CartService,) {
  }

  ionViewWillEnter() {
    this.updateOrderlines();
  }

  ngOnInit() {
    this.cartService.getBalanceAndLoyalty((b, l) => {
      this.balance = b;
      this.loyalty_point = l;
    });

    this.cartService.cartItems.subscribe(
      () => this.updateOrderlines()
    );
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
    // this.cartService.loadOrderlines(() => {
      let t = this.cartService.getReformedOrderlines();
      this.products = t || [];
      this.cartItemsLength = this.products.map(el => el.quantity).reduce((a, b) => a + b);

      this.computeTotalCost();
    // });
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
        this.alertCtrl.create({
          title: 'خطا',
          message: 'کد تخفیف وارد شده نامعتبر یا استفاده شده می باشد',
          buttons: [
            {
              text: 'بستن',
              role: 'cancel',
            }
          ]
        }).present();
        console.error('rejected: ', err);
      });
  }
}
