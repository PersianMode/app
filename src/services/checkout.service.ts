import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PaymentType} from '../enum/payment.type.enum';
import {CartService} from './cart.service';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';
import {DeliveryTime} from '../constants/deliveryTime.enum';
import {ReplaySubject} from 'rxjs/ReplaySubject';

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
  selectedDuration = null;
  selectedDeliveryTime = null;
  CCIncreaseLoyaltyPoints = [];
  loyaltyGroups = [];
  durations;
  deliveryPeriodDay;
  private system_offline_offer = 25000;
  private total = 0;
  private discount = 0;
  private loyaltyPointValue = 0;
  private balance = 0;
  balance$: ReplaySubject<number> = new ReplaySubject<number>();
  loyaltyPointValue$: ReplaySubject<number> = new ReplaySubject<number>();
  private earnSpentPointObj: any = {
    delivery_spent: 0,
    shop_spent: 0,
    delivery_value: 0,
    shop_value: 0,
    earn_point: 0,
  };

  constructor(private cartService: CartService, private httpService: HttpService,
    private authService: AuthService) {
    this.cartService.cartItems.subscribe(
      (data) => this.dataIsReady.next(data ? true : false)
    );
  }

  setAddress(address, isCC = false, duration = null, delivery_time = null) {
    this.selectedAddress = address;
    this.isClickAndCollect = isCC;
    this.selectedDuration = duration;
    this.selectedDeliveryTime = delivery_time ? DeliveryTime[delivery_time] : null;
  }

  setTotal(value) {
    this.total = value;
  }

  getLoyaltyBalance() {
    this.cartService.getBalanceAndLoyalty();
    this.cartService.balanceValue$.subscribe(
      data => {
        this.balance = data;
        this.balance$.next(data);
      },
      err => {
        this.balance = 0;
        this.balance$.next(0);
      });

    this.cartService.loyaltyPoints$.subscribe(
      data => {
        this.loyaltyPointValue = data;
        this.loyaltyPointValue$.next(data);
      },
      err => {
        this.loyaltyPointValue = 0;
        this.loyaltyPointValue$.next(0);
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
    const obj = {
      discount: this.discount,
      duration_days: this.selectedDuration ? this.selectedDuration.delivery_days : null,
      time_slot: this.selectedDeliveryTime,
      paymentType: this.selectedPaymentType,
      loyalty: this.earnSpentPointObj,
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

    return obj;
  }

  checkout() {
    return new Promise((resolve, reject) => {
      this.cartService.applyCoupon(this.cartService.coupon_code)
        .then(rs => {
          const data = this.accumulateData();
          this.httpService.post('checkout', data).subscribe(
            (res) => {
              this.cartService.emptyCart();
              this.cartService.getBalanceAndLoyalty();
              resolve();
            },
            (err) => {
              console.error('Error when checkout items: ', err);
              reject();
            }
          );
        });
    });
  }

  getDurations() {
    return new Promise((resolve, reject) => {
      this.httpService.get('deliveryduration').subscribe(
        (data) => {
          this.durations = data;
          this.deliveryPeriodDay = data.map(el => el.delivery_days);

          resolve();
        },
        (error) => {
          console.error(error);
          reject();
        });
    });
  }

  getAddLoyaltyPoints() {
    return new Promise((resolve, reject) => {
      this.httpService.get('deliverycc')
        .subscribe(res => {
          if (!res || !res.length)
            reject();
          else {
            this.CCIncreaseLoyaltyPoints = res[0].add_point;
            resolve();
          }
        },
          err => {
            console.error('Cannot get loyalty groups: ', err);
            reject();
          });
    });
  }

  getLoyaltyGroup() {
    return new Promise((resolve, reject) => {
      this.httpService.get('loyaltygroup')
        .subscribe(res => {
          this.loyaltyGroups = res;
          resolve();
        },
          err => {
            console.error('Cannot get loyalty groups: ', err);
            reject();
          });
    });
  }

  calculateEarnPoint() {
    let scoreArray;
    let maxScore;
    let customer_loyaltyGroup;
    let valid_loyaltyGroups;

    let earnedLoyaltyPoint = 0;

    if (this.selectedPaymentType !== this.paymentType.loyaltyPoint && !this.isClickAndCollect) {
      // calculate earn point
      earnedLoyaltyPoint = Math.floor(this.total / this.system_offline_offer);
    } else {
      // calculate earn point in C&C mode
      valid_loyaltyGroups = this.loyaltyGroups.filter(el => el.min_score <= this.loyaltyPointValue);

      if (!valid_loyaltyGroups.length) {
        scoreArray = this.loyaltyGroups.map(el => el.min_score);
        maxScore = Math.min(...scoreArray);
        customer_loyaltyGroup = this.loyaltyGroups.filter(el => el.min_score === maxScore);
      }
      else {
        scoreArray = valid_loyaltyGroups.map(el => el.min_score);
        maxScore = Math.max(...scoreArray);
        customer_loyaltyGroup = valid_loyaltyGroups.filter(el => el.min_score === maxScore);
      }
      earnedLoyaltyPoint = parseInt(this.CCIncreaseLoyaltyPoints.filter(el => el.name === customer_loyaltyGroup[0].name)[0].added_point)
        + Math.floor(this.total / this.system_offline_offer);
    }

    this.earnSpentPointObj = {
      delivery_spent: 0,
      shop_spent: 0,
      delivery_value: 0,
      shop_value: earnedLoyaltyPoint,
      earn_point: 0,
    }

    return earnedLoyaltyPoint;
  }

  calculateDeliveryDiscount(durationId) {
    let data = {
      customer_id: this.authService.userData.userId,
      duration_id: durationId
    };
    return new Promise((resolve, reject) => {
      this.httpService.post('/calculate/order/price', data)
        .subscribe(res => {
          resolve(res);
        },
          err => {
            reject();
          });
    });
  }

  finalCheck() {
    let cartItems = [];
    this.cartService.getCheckoutItems().forEach(r => {
      const count = r.instance.inventory.map(el => el.count).reduce((a, b) => a + b, 0);
      const reserved = r.instance.inventory.map(el => el.reserved ? el.reserved : 0).reduce((a, b) => a + b, 0);

      cartItems.push({
        product_id: r.product_id,
        product_instance_id: r.instance_id,
        price: r.cost,
        count: count - reserved,
        quantity: r.quantity,
        discount: r.discount
      });
    });

    return this.httpService.post('finalCheck', cartItems);
  }
}
