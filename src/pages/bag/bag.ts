import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {CartService} from "../../services/cart.service";
import {priceFormatter} from "../../shared/lib/priceFormatter";
import {CheckoutPage} from "../checkout/checkout";

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
    private cartService: CartService) {
  }

  ionViewWillEnter() {
    this.updateOrderlines();

    if(this.coupon_code) {
      this.applyCoupon();
    }
  }

  ngOnInit() {
    this.cartService.getBalanceAndLoyalty()
      .then(res => {
        this.balance = res['balance'];
        this.loyalty_point = res['loyalty_points'];
      })
      .catch(res => {
        this.balance = 0;
        this.loyalty_point = 0;
      })
  }

  onClickedOnPromoCode() {
    this.isPromoCodeShown = !this.isPromoCodeShown;
  }

  computeTotalCost(addCoupon = false) {
    this.totalCost = this.cartService.calculateTotal();
    this.discount = this.cartService.calculateDiscount(addCoupon);
    this.finalTotal = this.totalCost - this.discount;
  }

  updateOrderlines($event = null) {
    this.cartService.loadOrderlines()
      .then(res => {
        this.updateData();
      }).catch(err => {
        console.log('-> ', err);
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

  goToCheckoutPage() {
    this.cartService.coupon_code = this.coupon_code;
    this.navCtrl.push(CheckoutPage, {
      headerData: this.cartService.computeCheckoutTitlePage()
    });
  }
}
