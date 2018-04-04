import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PaymentType} from '../enum/payment.type.enum';
import {CartService} from './cart.service';
import {HttpService} from './http.service';

@Injectable()
export class CheckoutService {
  dataIsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private paymentType = PaymentType;
  private selectedPaymentType = this.paymentType.cash;
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

  setPaymentType(pt) {
    this.selectedPaymentType = pt;
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

  submitAddress(data) {
    if (!data)
      return Promise.reject(false);

    return new Promise((resolve, reject) => {
      this.httpService.post('user/address', data).subscribe(
        res => resolve(),
        err => reject(err)
      );
    });
  }
}
