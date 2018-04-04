import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {priceFormatter} from '../../shared/lib/priceFormatter';

@Component({
  selector: 'page-checkout-summary',
  templateUrl: 'checkout-summary.html',
})
export class CheckoutSummaryPage implements OnInit{
  total = 0;
  discount = 0;
  usedBalance = 0;
  usedLoyaltyPoint = 0;
  finalTotal = 0;

  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
  }

  ngOnInit() {
    this.total = this.getValue(this.navParams.get('total'));
    this.discount = this.getValue(this.navParams.get('discount'));
    this.usedBalance = this.getValue(this.navParams.get('usedBalance'));
    this.usedLoyaltyPoint = this.getValue(this.navParams.get('usedLoyaltyPoint'));

    this.finalTotal = this.total - (this.discount ? this.discount : 0);
    if(this.usedBalance && this.usedBalance > this.finalTotal) {
      this.usedBalance = this.finalTotal;
      this.finalTotal = 0;
    } else if(this.usedLoyaltyPoint && this.usedLoyaltyPoint > this.finalTotal) {
      this.usedLoyaltyPoint = this.finalTotal;
      this.finalTotal = 0;
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  getValue(value) {
    if (value)
      return +value;

    return null;
  }

  priceFormatter(p) {
    return priceFormatter(p);
  }

  placeOrder() {

  }
}
