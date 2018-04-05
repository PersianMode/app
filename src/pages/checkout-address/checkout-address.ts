import {Component, OnInit} from '@angular/core';
import {NavParams, PopoverController, ViewController} from 'ionic-angular';
import {AddressPage} from '../address/address';

@Component({
  selector: 'page-checkout-address',
  templateUrl: 'checkout-address.html',
})
export class CheckoutAddressPage implements OnInit {
  isClickAndCollect = false;
  customerAddressList = [];
  inventoryAddressList = [];
  selectedAddress = null;

  constructor(private viewCtrl: ViewController, private navParams: NavParams,
              private popCtrl: PopoverController) {
  }

  ngOnInit() {
    this.customerAddressList = this.navParams.get('customer_address');
    this.inventoryAddressList = this.navParams.get('inventory_address');

    if (this.navParams.get('isCC') === true || this.navParams.get('isCC') === false)
      this.isClickAndCollect = this.navParams.get('isCC');

    if (this.navParams.get('currentSelectedAddress'))
      this.selectedAddress = this.navParams.get('currentSelectedAddress');
  }

  close() {
    this.viewCtrl.dismiss({selectedAddress: this.selectedAddress, isCC: this.isClickAndCollect});
  }

  setAddress(address) {
    this.selectedAddress = address;
  }

  addressDetailForm(myEvent, address, isCC = true) {
    const addressPage = this.popCtrl.create(AddressPage, {
      address: address,
      isInventoryAddress: isCC
    }, {
      enableBackdropDismiss: false,
      cssClass: 'address-details'
    });

    addressPage.present({
      ev: myEvent
    });
  }

  compareAddress(address) {
    return this.selectedAddress && address && address._id && this.selectedAddress._id.toString() === address._id.toString();
  }

  updateAddress() {

  }
}
