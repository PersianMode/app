import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavController, NavParams} from "ionic-angular";
import {CheckoutService} from '../../services/checkout.service';
import {PaymentType} from '../../enum/payment.type.enum';
import {AddressPage} from '../address/address';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  total = 0;
  discount = 0;
  usedBalance = 0;
  usedLoyaltyPoint = 0;
  userBalance = 0;
  userLoyaltyPointValue = 0;
  headerData;
  addressIsSet = false;
  paymentType = PaymentType;
  private itemList = [
    {
      item: 'payment',
      value: false,
    },
    {
      item: 'address',
      value: false,
    }
  ];

  constructor(private navParams: NavParams,
              private checkoutService: CheckoutService, private navCtrl: NavController) {
  }

  ionViewWillEnter() {
    this.navBar.setBackButtonText('بازگشت');
  }

  ngOnInit() {
    this.headerData = this.navParams.get('headerData') || {};
    this.checkoutService.dataIsReady.subscribe(
      (data) => {
        if (data) {
          const tempTotalDiscount = this.checkoutService.getTotalDiscount();
          this.total = tempTotalDiscount.total;
          this.discount = tempTotalDiscount.discount;
        }
      }
    );

    this.checkoutService.getLoyaltyBalance()
      .then((res: any) => {
        this.userBalance = res.balance;
        this.userLoyaltyPointValue = res.loyaltyPointValue;

        switch (this.checkoutService.selectedPaymentType) {
          case this.paymentType.balance:
            this.usedBalance = this.userBalance;
            break;
          case this.paymentType.loyaltyPoint:
            this.usedLoyaltyPoint = this.userLoyaltyPointValue;
            break;
        }
      }).catch(err =>{
        console.log('-> ', err);
      });

    this.addressIsSet = this.checkoutService.selectedAddress ? true : false;
  }

  itemIsOpen(item) {
    const index = this.itemList.findIndex(el => el.item.toLowerCase() === item.toLowerCase());
    return index < 0 ? false : this.itemList[index].value;
  }

  toggleItem(item) {
    const index = this.itemList.findIndex(el => el.item.toLowerCase() === item.toLowerCase());
    if (index < 0)
      return;
    this.itemList[index].value = !this.itemList[index].value;
  }

  getSelectedPaymentType() {
    return this.checkoutService.selectedPaymentType;
  }

  setPayment(data) {
    this.usedLoyaltyPoint = 0;
    this.usedBalance = 0;

    if (data === this.paymentType.balance)
      this.usedBalance = this.userBalance;
    else if (data === this.paymentType.loyaltyPoint)
      this.usedLoyaltyPoint = this.userLoyaltyPointValue;

    this.checkoutService.selectedPaymentType = data;
  }

  changeAddress(data) {
    this.checkoutService.setAddress(data.selectedAddress, data.isCC);
    this.addressIsSet = data.selectedAddress;
  }

  showAddressDetails(data) {
    this.navCtrl.push(AddressPage, data);
  }

  placeOrder() {

  }
}
