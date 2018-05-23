import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoadingController} from 'ionic-angular';
import {CheckoutService} from '../../../services/checkout.service';

@Component({
  selector: 'checkout-address',
  templateUrl: './checkout-address.html',
})
export class CheckoutAddress implements OnInit {
  @Output() addressChanged = new EventEmitter();
  @Output() addressDetails = new EventEmitter();
  isClickAndCollect = false;
  customerAddressList = [];
  inventoryAddressList = [];
  selectedAddress = null;

  constructor(private checkoutService: CheckoutService, private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.selectedAddress = this.checkoutService.selectedAddress;
    this.isClickAndCollect = this.checkoutService.isClickAndCollect;

    const addressLoading = this.loadingCtrl.create({
      content: 'در حال دریافت آدرس های شما ...',
    });

    addressLoading.present();

    this.checkoutService.getAddresses()
      .then((res: any) => {
        this.customerAddressList = res.customer;
        this.inventoryAddressList = res.inventories;

        addressLoading.dismiss().catch(err => console.log('-> ', err));
      })
      .catch(err => {
        console.error('Cannot fetch addresses of customer and inventories: ', err);
        addressLoading.dismiss().catch(err => console.log('-> ', err));
      });

    this.checkoutService.upsertAddress.subscribe(
      (data) => {
        if(data) {
          let existAddress = this.customerAddressList.find(el => el._id.toString() === data._id.toString());
          if(!existAddress)
            this.customerAddressList.push(data);
          else
            existAddress = data;
          this.setAddress(data);
        }
      }
    )
  }

  setAddress(address) {
    this.selectedAddress = address;
    this.addressChanged.emit({
      selectedAddress: this.selectedAddress,
      isCC: this.isClickAndCollect,
    });
  }

  addressDetailForm(address, isCC = true) {
    this.addressDetails.emit({
      address: address,
      isInventoryAddress: isCC,
    });
  }

  compareAddress(address) {
    return this.selectedAddress && address && address._id && this.selectedAddress._id.toString() === address._id.toString();
  }
}
