import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {PaymentType} from '../../enum/payment.type.enum';
import {priceFormatter} from '../../shared/lib/priceFormatter';

@Component({
  selector: 'page-checkout-payment-type',
  templateUrl: 'checkout-payment-type.html',
})
export class CheckoutPaymentTypePage implements OnInit{
  paymentType = PaymentType;
  selectedType: any = this.paymentType.cash;
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

  constructor(private viewCtrl: ViewController, private  navParams: NavParams) {
  }

  ngOnInit() {
    if(this.navParams.get('currentSelectedType'))
      this.selectedType = this.navParams.get('currentSelectedType');

    if (this.getValue(this.navParams.get('balance'))) {
      this.pType.find(el => el.value === this.paymentType.balance).disabled = false;
      this.pType.find(el => el.value === this.paymentType.balance).amount = this.getValue(this.navParams.get('balance'));
    }
    if (this.getValue(this.navParams.get('loyaltyPointValue'))) {
      this.pType.find(el => el.value === this.paymentType.loyaltyPoint).disabled = false;
      this.pType.find(el => el.value === this.paymentType.loyaltyPoint).amount = this.getValue(this.navParams.get('loyaltyPointValue'));
    }
  }

  close() {
    this.viewCtrl.dismiss(this.selectedType);
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
  }
}
