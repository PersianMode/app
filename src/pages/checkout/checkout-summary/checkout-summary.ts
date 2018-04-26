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
    return this._total;
  }

  @Input()
  set discount(value) {
    this._discount = value;
    this.calculateTotal();
  }
  get discount() {
    return this._discount;
  }

  @Input()
  set usedBalance(value) {
    this._usedBalance = value;
    this.calculateTotal();
  }

  get usedBalance() {
    return this._usedBalance;
  }

  @Input()
  set usedLoyaltyPoint(value) {
    this._usedLoyaltyPoint = value;
    this.calculateTotal();
  }
  get usedLoyaltyPoint(){
    return this._usedLoyaltyPoint;
  }

  private _total = 0;
  private _discount = 0;
  private _usedBalance = 0;
  private _usedLoyaltyPoint = 0;
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
    this.finalTotal = this.total - (this.discount ? this.discount : 0);
    if (this.usedBalance && this.usedBalance > this.finalTotal) {
      this.usedBalance = this.finalTotal;
      this.finalTotal = 0;
    } else if (this.usedLoyaltyPoint && this.usedLoyaltyPoint > this.finalTotal) {
      this.usedLoyaltyPoint = this.finalTotal;
      this.finalTotal = 0;
    }
  }
}
