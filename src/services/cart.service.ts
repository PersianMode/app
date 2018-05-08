import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {priceFormatter} from '../shared/lib/priceFormatter';
import {AuthService} from './auth.service';

@Injectable()
export class CartService {
  dataArray: any = [];
  cartItems: ReplaySubject<number> = new ReplaySubject<number>();
  coupon_discount = 0;
  coupon_code = '';

  constructor(private httpService: HttpService, private authService: AuthService) {
    this.loadOrderlines().catch(err => {
      console.error('-> ', err);
    });
  }

  loadOrderlines(): any {
    if (this.authService.isFullAuthenticated.getValue())
      return new Promise((resolve, reject) => {
        this.httpService.post(`cart/items`, {data: {}}).subscribe(
          data => {
            this.updateInfo(data);
            this.dataArray = data;
            resolve();
          },
          err => {
            console.error("error in loading orderlines:", err);
            reject(err);
          }
        );
      });
    return Promise.resolve();
  }

  updateInfo(data) {
    this.dataArray = data;
    this.cartItems.next(this.getTotalNumber());
  }

  addOrderline(product_id, product_instance_id, number) {
    return new Promise((resolve, reject) => {
      let data = {product_id, product_instance_id, number};
      this.httpService.post(`order`, data).subscribe(
        res => {
          if (res.n <= 0 && res.nModified <= 0)
            return Promise.reject("nothing's changed");

          this.loadOrderlines().catch(err => {
            reject(err);
          });
          resolve();

        },
        err => {
          console.error("error in adding orderline", err);
          reject();
        }
      );
    })
  }

  removeOrderline(product_instance_id, number) {
    return new Promise((resolve, reject) => {
      number = number || -1;
      let data = {product_instance_id, number};
      this.httpService.post(`order/delete`, data).subscribe(
        res => {
          if (res.n <= 0 && res.nModified <= 0)
            return Promise.reject("nothing's changed");

          this.loadOrderlines().catch(err => {
            console.log('-> ', err);
          });
          resolve();
        },
        err => {
          console.error("error in removing orderline", err);
          reject();
        }
      );
    })
  }

  getTotalNumber() {
    let counter = 0;
    this.dataArray.forEach(elem => counter += elem["quantity"] || 0);
    return counter;
  }

  getReformedOrderlines() {
    if (this.dataArray.length <= 0 ||
      (this.dataArray && this.dataArray.length === 1 && !this.dataArray[0]["product_id"]))
      return null;

    return this.dataArray.map(el => {

      return Object.assign({
        cost: el.instance_price ? el.instance_price : el.base_price,
        product_color_id: el.color ? el.color.id : null,
        color: (el.color && el.color.name) || "defaultColor",
      }, el);
    });
  }

  getBalanceAndLoyalty() {
    return new Promise((resolve, reject) => {
      this.httpService.get(`customer/balance`).subscribe(
        data => {
          resolve({balance: data["balance"], loyalty_points: data["loyalty_points"]});
        },
        err => {
          console.error("couldn't get balance and loyalty points");
          reject(0);
        }
      );
    })
  }

  calculateTotal() {
    if (this.dataArray && this.dataArray.length > 0) {
      return this.dataArray
        .filter(el => el.count && el.quantity <= el.count)
        .map(el => (el.instance_price ? el.instance_price : el.base_price) * el.quantity)
        .reduce((a, b) => a + b);
    }

    return 0;
  }

  calculateDiscount(addCoupon = true) {
    let discountValue = 0;

    if (this.dataArray.length > 0) {
      this.dataArray.forEach(el => {
        // let tempTotalDiscount = el.discount && el.discount.length > 0 ? el.discount.reduce((a, b) => a * b) : 0;

        // tempTotalDiscount = Number(tempTotalDiscount.toFixed(5));

        let tempTotalDiscount = el.discount ? el.discount : 0;

        if (el.coupon_discount) {
          if (addCoupon)
            tempTotalDiscount += Number(el.coupon_discount.toFixed(5));
        }

        const price = el.instance_price ? el.instance_price : el.base_price;
        discountValue += (price - ((1 - tempTotalDiscount) * price)) * el.quantity;
      });
    }

    return discountValue;
  }

  addCoupon(coupon_code = "") {
    if (coupon_code.length <= 0)
      return Promise.resolve(false);

    return new Promise((resolve, reject) => {
      if (this.dataArray && this.dataArray.length > 0)
        this.httpService.post("coupon/code/valid", {
          product_ids: Array.from(new Set(this.dataArray.map(el => el.product_id.toString()))),
          coupon_code: coupon_code,
        }).subscribe(
          (data) => {
            if (data) {
              data = data[0];
              this.dataArray.forEach(el => {
                el["coupon_discount"] = data.discount_ref;
              });

              resolve(true);
            } else
              reject({});

            // const someItems = this.dataArray.filter(el => el.product_id.toString() === data.product_id.toString());
            // if (someItems && someItems.length > 0) {
            //   someItems.forEach(el => {
            //     el["coupon_discount"] = 1 - data.discount;
            //   });
            //   resolve(true);
            // } else
            //   reject({});
          },
          (err) => {
            reject(err);
          });
    });
  }

  applyCoupon(coupon_code): any {
    if (!coupon_code)
      return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.httpService.post("coupon/code/apply", {
        coupon_code: coupon_code,
      }).subscribe(
        (data) => {
          resolve();
        },
        (err) => {
          reject(err);
        });
    });
  }

  computeCheckoutTitlePage() {
    let data = {
      title: "پرداخت",
      subtitle: "",
    };

    if (this.dataArray.length === 1) {
      data["title"] = this.dataArray[0]["name"];
      data["subtitle"] = this.dataArray[0]["color"]["name"];
    } else {
      data["subtitle"] += priceFormatter(this.getTotalNumber()) + " عدد"
    }

    return data;
  }

  getCheckoutItems() {
    return this.dataArray
      .map(r => Object.assign({}, {
        product_id: r.product_id,
        product_instance_id: r.instance_id,
        number: r.quantity,
      }));
  }

  getOrderId() {
    if (this.dataArray.length)
      return this.dataArray[0].order_id;
    return null;
  }
}
