import {Component, OnInit} from '@angular/core';
import {NavParams, PopoverController} from "ionic-angular";
import {CheckoutPaymentTypePage} from '../checkout-payment-type/checkout-payment-type';
import {CheckoutSummaryPage} from '../checkout-summary/checkout-summary';
import {CheckoutService} from '../../services/checkout.service';
import {PaymentType} from '../../enum/payment.type.enum';
import {CheckoutAddressPage} from '../checkout-address/checkout-address';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage implements OnInit{
  total = 0;
  discount = 0;
  usedBalance = 0;
  usedLoyaltyPoint = 0;
  headerData;
  addressIsSet = false;
  paymentType = PaymentType;

  constructor(private navParams: NavParams, private popoverCtrl: PopoverController,
              private checkoutService: CheckoutService) {
  }

  ngOnInit() {
    this.headerData = this.navParams.get('headerData') || {};
    this.checkoutService.dataIsReady.subscribe(
      (data) => {
        if(data) {
          const tempTotalDiscount = this.checkoutService.getTotalDiscount();
          this.total = tempTotalDiscount.total;
          this.discount = tempTotalDiscount.discount;
        }
      }
    );
  }

  goToPaymentType(myEvent) {
    this.checkoutService.getLoyaltyBalance()
      .then((res: any) => {
        const paymentPage = this.popoverCtrl.create(CheckoutPaymentTypePage, {
          balance: res.balance,
          loyaltyPointValue: res.loyaltyPointValue,
          currentSelectedType: (this.usedBalance ? this.paymentType.balance : (this.usedLoyaltyPoint ? this.paymentType.loyaltyPoint : this.paymentType.cash))
        }, {
          enableBackdropDismiss: false
        });

        paymentPage.onDidDismiss((data) => {
          this.usedLoyaltyPoint = 0;
          this.usedBalance = 0;

          if(data === this.paymentType.balance)
            this.usedBalance = res.balance;

          if(data === this.paymentType.loyaltyPoint)
            this.usedLoyaltyPoint = res.loyaltyPointValue;

          this.checkoutService.setPaymentType(data);
        });
        paymentPage.present({
          ev: myEvent
        });
      });
  }

  goToAddress(myEvent) {
    this.checkoutService.getAddresses()
      .then((res: any) => {
        const addressPage = this.popoverCtrl.create(CheckoutAddressPage, {
          currentSelectedAddress: this.checkoutService.selectedAddress,
          customer_address: res.customer,
          inventory_address: res.inventories,
          isCC: this.checkoutService.isClickAndCollect,
        }, {
          enableBackdropDismiss: false,
          cssClass: 'checkout-address',
        });

        addressPage.onDidDismiss(
          (data) => {
            this.checkoutService.setAddress(data.selectedAddress, data.isCC);
            this.addressIsSet = data.selectedAddress;
          }
        );

        addressPage.present({
          ev: myEvent
        });
      })
  }

  goToSummary(myEvent) {
    this.popoverCtrl.create(CheckoutSummaryPage, {
      total: this.total,
      discount: this.discount,
      usedBalance: this.usedBalance,
      usedLoyaltyPoint: this.usedLoyaltyPoint
    }, {
      enableBackdropDismiss: false
    }).present({
      ev: myEvent
    });
  }

  placeOrder() {

  }
}
