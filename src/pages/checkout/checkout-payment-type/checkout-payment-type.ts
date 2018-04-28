import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PaymentType} from '../../../enum/payment.type.enum';
import {priceFormatter} from '../../../shared/lib/priceFormatter';

@Component({
  selector: 'checkout-payment-type',
  templateUrl: './checkout-payment-type.html',
})
export class CheckoutPaymentType implements OnInit {
  @Input()
  set selectedType(value) {
    this._selectedType = value ? value : this.paymentType.cash;
  }

  get selectedType() {
    return this._selectedType;
  }

  @Input()
  set balance(value) {
    if (value) {
      this.pType.find(el => el.value === this.paymentType.balance).disabled = false;
      this.pType.find(el => el.value === this.paymentType.balance).amount = this.getValue(value);
    } else {
      this.pType.find(el => el.value === this.paymentType.balance).disabled = true;
      this.pType.find(el => el.value === this.paymentType.balance).amount = 0;
    }
  }

  @Input()
  set loyaltyPointValue(value) {
    if (value) {
      this.pType.find(el => el.value === this.paymentType.loyaltyPoint).disabled = false;
      this.pType.find(el => el.value === this.paymentType.loyaltyPoint).amount = this.getValue(value);
    } else {
      this.pType.find(el => el.value === this.paymentType.loyaltyPoint).disabled = true;
      this.pType.find(el => el.value === this.paymentType.loyaltyPoint).amount = 0;
    }
  }

  @Output() typeChanged = new EventEmitter();

  paymentType = PaymentType;
  private _selectedType: any = this.paymentType.cash;
  pType = [
    {
      name: 'نقدی',
      value: this.paymentType.cash,
      disabled: false,
      amount: null,
    },
    {
      name: 'موجودی',
      value: this.paymentType.balance,
      disabled: true,
      amount: 0,
    },
    {
      name: 'امتیاز وفاداری',
      value: this.paymentType.loyaltyPoint,
      disabled: true,
      amount: 0,
    },
  ];

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

  setType(value) {
    this.selectedType = value;
    this.typeChanged.emit(value);
  }
}
