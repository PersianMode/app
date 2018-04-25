import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PaymentType} from '../enum/payment.type.enum';
import {CartService} from './cart.service';
import {HttpService} from './http.service';

@Injectable()
export class CheckoutService {
  dataIsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private paymentType = PaymentType;
  upsertAddress: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedPaymentType = this.paymentType.cash;
  selectedAddress = null;
  isClickAndCollect = false;
  private readonly loyaltyValue = 1000;
  private total = 0;
  private discount = 0;
  private loyaltyPointValue = 0;
  private balance = 0;

  constructor(private cartService: CartService, private httpService: HttpService) {
    this.cartService.cartItems.subscribe(
      (data) => this.dataIsReady.next(data ? true : false)
    );
  }

  setAddress(address, isCC = false) {
    this.selectedAddress = address;
    this.isClickAndCollect = isCC;
  }

  getLoyaltyBalance() {
    return new Promise((resolve, reject) => {
      this.cartService.getBalanceAndLoyalty()
        .then((res: any) => {
          this.balance = res.balance;
          this.loyaltyPointValue = res.loyalty_points * this.loyaltyValue;

          resolve({
            balance: this.balance,
            loyaltyPointValue: this.loyaltyPointValue,
          });
        })
        .catch(err => reject(err));
    });
  }

  getTotalDiscount() {
    this.total = this.cartService.calculateTotal();
    this.discount = this.cartService.calculateDiscount(true);

    return {
      total: this.total,
      discount: this.discount,
    };
  }

  getAddresses() {
    return new Promise((resolve, reject) => {
      let customerAddress = [];

      this.getCustomerAddress()
        .then((res: any) => {
          customerAddress = res;
          return this.getInventoryAddress();
        })
        .then((res: any) => {
          resolve({
            customer: customerAddress,
            inventories: res.address,
          });
        })
        .catch(err => reject(err));
    });
  }

  private getCustomerAddress() {
    return new Promise((resolve, reject) => {
      this.httpService.get('customer/address').subscribe(
        (data) => {
          resolve(data.addresses);
        },
        (err) => {
          console.error('Cannot fetch customer address: ', err);
          reject(err);
        }
      );
    });
  }

  private getInventoryAddress() {
    return Promise.resolve({
      address: [
        {
          '_id': '5bb78610727eb0fbaaccb573',
          'province': 'تهران',
          'city': 'تهران',
          'street': ' کوچه شهریور ',
          'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
          'no': '۵',
          'unit': '۱',
          'name': 'پالادیوم'
        },
        {
          '_id': '5bb78610727eb0fbaaccb574',
          'province': 'تهران',
          'city': 'تهران',
          'street': ' کوچه شهریور ',
          'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
          'no': '۵',
          'unit': '۱',
          'name': 'سانا'
        },
        {
          '_id': '5bb78610727eb0fbaaccb575',
          'province': 'تهران',
          'city': 'تهران',
          'street': ' کوچه شهریور ',
          'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
          'no': '۵',
          'unit': '۱',
          'name': 'ایران مال'
        }]
    });

    // return new Promise((resolve, reject) => {
    //   this.httpService.get('inventory/address').subscribe(
    //     (data) => {
    //       resolve(data.addresses);
    //     },
    //     (err) => {
    //       console.error('Cannot fetch customer address: ', err);
    //       reject(err);
    //     }
    //   );
    // });
  }

  saveAddress(addressData) {
    return new Promise((resolve, reject) => {
      this.httpService.post('user/address', addressData).subscribe(
        (data) => {
          resolve(data);
          if (!addressData._id)
            Object.assign(addressData, {_id: data.addresses[data.addresses.length - 1]._id});
          this.upsertAddress.next(addressData);
        },
        (err) => reject(err)
      );
    });
  }
}
