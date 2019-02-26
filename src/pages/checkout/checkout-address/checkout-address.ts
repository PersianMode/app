import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CheckoutService} from '../../../services/checkout.service';
import {LoadingService} from '../../../services/loadingService';
import {DeliveryTime} from '../../../constants/deliveryTime.enum';

@Component({
  selector: 'checkout-address',
  templateUrl: './checkout-address.html',
})
export class CheckoutAddress implements OnInit {
  @Output() addressChanged = new EventEmitter();
  @Output() addressDetails = new EventEmitter();
  durations = [];
  deliveryTimeList = DeliveryTime;
  isClickAndCollect = false;
  customerAddressList = [];
  inventoryAddressList = [];
  selectedAddress = null;
  selectedDuration = null;
  selectedDeliveryTime = null;

  constructor(private checkoutService: CheckoutService, private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.selectedAddress = this.checkoutService.selectedAddress;
    this.isClickAndCollect = this.checkoutService.isClickAndCollect;

    this.loadingService.enable({
      content: 'در حال دریافت اطلاعات ...',
    }, 0, () => {
      let receivedCount = 0;

      this.checkoutService.getAddresses()
        .then((res: any) => {
          this.customerAddressList = res.customer;
          this.inventoryAddressList = res.inventories;
          receivedCount++;
  
          if (receivedCount === 2)
            this.loadingService.disable();
        })
        .catch(err => {
          console.error('Cannot fetch addresses of customer and inventories: ', err);
          this.loadingService.disable();
        });
  
      this.checkoutService.getDurations()
        .then(() => {
          this.durations = this.checkoutService.durations;
          receivedCount++;
  
          if (receivedCount === 2)
            this.loadingService.disable();
        })
        .catch(err => {
          console.error('CAnnot fetch durations details: ', err);
          this.loadingService.disable();
        });
    });

    this.checkoutService.upsertAddress.subscribe(
      (data) => {
        if (data) {
          let existAddress = this.customerAddressList.find(el => el._id.toString() === data._id.toString());
          if (!existAddress)
            this.customerAddressList.push(data);
          else
            existAddress = data;
          this.setAddress(data);
        }
      });
  }

  setAddress(address = null) {
    if (address)
      this.selectedAddress = address;

    this.addressChanged.emit({
      selectedAddress: this.selectedAddress,
      isCC: this.isClickAndCollect,
      duration: this.selectedDuration,
      delivery_time: this.selectedDeliveryTime,
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

  getDeliveryTimeList() {
    return Object.keys(this.deliveryTimeList);
  }

  selectDuration(duration) {
    this.selectedDuration = duration;
    this.setAddress();
  }

  selectDeliveryTime(deliveryTime) {
    this.selectedDeliveryTime = deliveryTime;
    this.setAddress();
  }

  getDeliveryTimeDisplay(deliveryTime) {
    return this.deliveryTimeList[deliveryTime].lower_bound.toLocaleString('fa') + ' تا ' + this.deliveryTimeList[deliveryTime].upper_bound.toLocaleString('fa');
  }

  toggleDeliveryDestination() {
    this.selectedAddress = null;
    this.selectedDuration = null;
    this.selectedDeliveryTime = null;
    this.setAddress();
  }
}
