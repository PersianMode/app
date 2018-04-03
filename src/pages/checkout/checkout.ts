import {Component} from '@angular/core';
import {NavParams} from "ionic-angular";

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  finalTotal;
  headerData;

  constructor(private navParams: NavParams) {
    this.finalTotal = this.navParams.get('finalTotal') || 0;
    this.headerData = this.navParams.get('headerData') || {};
  }
}
