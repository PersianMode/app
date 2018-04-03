import {Component} from '@angular/core';
import {NavParams} from "ionic-angular";
import {priceFormatter} from "../../shared/lib/priceFormatter";

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  finalTotal;
  headerData;
  isPlaceOrderDisable;

  constructor(private navParams: NavParams) {
    this.finalTotal = this.navParams.get('finalTotal') || 0;
    this.headerData = this.navParams.get('headerData') || {};
    this.isPlaceOrderDisable = true;
  }

  formatPrice(p) {
    return priceFormatter(p);
  }

  popAddress() {

  }

  popPayment() {

  }

  popSummary() {

  }

  placeOrder() {

  }
}
