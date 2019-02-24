import {Component, Input, OnInit} from '@angular/core';
import {priceFormatter} from '../../../shared/lib/priceFormatter';

@Component({
  selector: 'checkout-summary',
  templateUrl: './checkout-summary.html',
})
export class CheckoutSummary implements OnInit {
  @Input()
  set total(value) {
    this._total = value;
    this.calculateTotal();
  }

  get total() {
    console.log(this._total);
    return this._total;
  }

  // @Input()
  // set earnedLoyaltyPoint(value) {
  //   this._earnedLoyaltyPoint = value;
  // }
  //
  // get earnedLoyaltyPoint(){
  //   return this._earnedLoyaltyPoint;
  // }

  @Input()
  set showCostLabel(value) {
    this._showCostLabel = value;

    this.calculateTotal();
  }

  get showCostLabel() {
    return this._showCostLabel;
  }

  @Input()
  set deliveryCost(value) {
    this._deliveryCost = value;
    if (value) {
      this.calculateTotal();
    }
  }

  get deliveryCost() {
    return this._deliveryCost;
  }

  @Input()
  set deliveryDiscount(value) {
    if (!value)
      value = 0;

    this._deliveryDiscount = value;
    this.calculateTotal();
  }

  get deliveryDiscount() {
    return this._deliveryDiscount;
  }

  @Input()
  set discount(value) {
    this._discount = value;
    this.calculateTotal();
  }

  get discount() {
    return this._discount || 0;
  }

  @Input()
  set usedBalance(value) {
    this._usedBalance = value;
    this.calculateTotal();
  }

  get usedBalance() {
    return this._usedBalance;
  }

  // @Input()
  // set usedLoyaltyPoint(value) {
  //   this._usedLoyaltyPoint = value;
  //   this.calculateTotal();
  // }
  // get usedLoyaltyPoint() {
  //   return this._usedLoyaltyPoint;
  // }

  private _total = 0;
  private _discount = 0;
  private _usedBalance = 0;
  // private _usedLoyaltyPoint = 0;
  private _showCostLabel = false;
  private _deliveryCost = 0;
  private _deliveryDiscount = 0;
  // private _earnedLoyaltyPoint = 0;
  finalTotal = 0;

  constructor() {
  }

  ngOnInit() {
  }

  getValue(value) {
    if (value)
      return +value;

    return null;
  }

  priceFormatter(p) {
    return priceFormatter(p);
  }

  calculateTotal() {
    // this.finalTotal = this.total + this.deliveryCost - this.discount - this.usedBalance - this.usedLoyaltyPoint - this.deliveryDiscount;
    this.finalTotal = this.total + this.deliveryCost - this.discount - this.usedBalance - this.deliveryDiscount;
    if (this.usedBalance && this.usedBalance > this.finalTotal) {
      this.usedBalance = this.finalTotal;
      this.finalTotal = 0;
    } else {
      // this.finalTotal = 0;
    }
    // else if (this.usedLoyaltyPoint && this.usedLoyaltyPoint > this.finalTotal) {
    //   this.usedLoyaltyPoint = this.finalTotal;
    //   this.finalTotal = 0;
    // }
  }
}
