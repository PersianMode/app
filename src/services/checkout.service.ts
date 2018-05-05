import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PaymentType} from '../enum/payment.type.enum';
import {CartService} from './cart.service';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';

@Injectable()
export class CheckoutService {
  dataIsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private paymentType = PaymentType;
  upsertAddress: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  customerAddressList = [];
  inventoryAddressList = [];
  addressIsUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedPaymentType = this.paymentType.cash;
  selectedAddress = null;
  isClickAndCollect = false;
  private readonly loyaltyValue = 1000;
  private total = 0;
  private discount = 0;
  private loyaltyPointValue = 0;
  private balance = 0;

  constructor(private cartService: CartService, private httpService: HttpService,
    private authService: AuthService) {
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
        })
        .then((res: any) => {
          resolve({
            customer: customerAddress,
            inventories: res,
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
    return new Promise((resolve, reject) => {
      this.httpService.get('warehouse').subscribe(
        (data) => {
          const inventoriesAddress = [];
          data.forEach(el => {
            inventoriesAddress.push(Object.assign(el.address, {
              name: el.name,
              phone: el.phone,
              is_center: el.is_center,
            }));
          });

          resolve(inventoriesAddress);
        },
        (err) => {
          console.error('Cannot fetch customer address: ', err);
          reject(err);
        }
      );
    });
  }

  saveAddress(addressData) {
    return new Promise((resolve, reject) => {
      this.httpService.post('user/address', addressData).subscribe(
        (data) => {
          if (!addressData._id)
            Object.assign(addressData, {_id: data.addresses[data.addresses.length - 1]._id});
          this.upsertAddress.next(addressData);
          resolve(data);
        },
        (err) => reject(err)
      );
    });
  }

  private accumulateData() {
    return {
      cartItems: this.cartService.getCheckoutItems(),
      order_id: this.cartService.getOrderId(),
      address: this.selectedAddress,
      customerData: this.authService.userData,
      transaction_id: 'xyz' + Math.floor(Math.random() * 10000),
      used_point: 0,
      used_balance: 0,
      total_amount: this.total,
      is_collect: this.isClickAndCollect,
    };
  }

  checkout() {
    const data = this.accumulateData();
    this.httpService.post('checkout', data).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error('Error when checkout items: ', err);
      }
    );
  }
}
