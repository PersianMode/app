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
  }

  onClickedOnPromoCode() {
    this.isPromoCodeShown = !this.isPromoCodeShown;
  }

  computeTotalCost(addCoupon = false) {
    this.totalCost = 0;
    this.discount = 0;

    this.products.forEach(e => {
      const price = e.final_cost ? e.final_cost : e.cost;

      // Compute total cost
      this.totalCost += price * (e.quantity ? e.quantity : 1);

      // Compute total discount
      let tempTotalDiscount = e.discount && e.discount.length > 0 ? e.discount.reduce((a, b) => a * b) : 0;
      if (e.coupon_discount) {
        if (addCoupon)
          tempTotalDiscount *= e.coupon_discount;
        else
          tempTotalDiscount *= (1 / e.coupon_discount);
      }

      // Round the discount
      tempTotalDiscount = Number(tempTotalDiscount.toFixed(5));

      this.discount += (price - (tempTotalDiscount * price)) * e.quantity;
    });

    this.finalTotal = this.totalCost - this.discount;
  }

  updateOrderlines($event = null) {
    this.cartService.loadOrderlines(() => {
      this.updateData();
    });
  }

  updateData(addCoupon?) {
    let t = this.cartService.getReformedOrderlines();
    this.products = t || [];
    const quantityList = this.products.map(el => el.quantity);
    this.cartItemsLength = (quantityList && quantityList.length > 0) ? quantityList.reduce((a, b) => a + b) : 0;

    this.computeTotalCost(addCoupon);
  }

  formatPrice(p) {
    return priceFormatter(p);
  }

  applyCoupon() {
    this.cartService.addCoupon(this.coupon_code)
      .then((res) => {
        this.updateData(res);
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
