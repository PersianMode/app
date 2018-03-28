import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class CartService {
  dataArray: any = [];
  cartItems: ReplaySubject<number> = new ReplaySubject<number>();
  coupon_discount = 0;

  constructor(private httpService: HttpService) {
    this.loadOrderlines();
  }

  loadOrderlines(cb = null) {
    this.httpService.post(`cart/items`, {data: {}}).subscribe(
      data => {
        this.updateInfo(data);
        this.dataArray = data;
        if (cb) cb();
      }, err => {
        console.error("err", err);
      }
    );
  }

  updateInfo(data) {
    this.dataArray = data;
    this.cartItems.next(this.getTotalNumber());
  }

  addOrderline(product_id, product_instance_id, number, cb) {
    let data = {product_id, product_instance_id, number};
    this.httpService.post(`order`, data).subscribe(
      res => {
        // this.dataArray.push({
        //   instance_id: product_instance_id,
        //   quantity: number,
        // });
        // this.cartItems.next(this.getTotalNumber());
        this.loadOrderlines();
        if (!(res.n > 0 || res.nModified > 0))
          return cb('nothing is changed');

        if (cb) cb(null);
      }, err => {
        console.error('error in adding orderline', err);
        if (cb) cb(err);
      }
    );
  }

  removeOrderline(product_instance_id, number, cb) {
    number = number || -1;
    let data = {product_instance_id, number};
    this.httpService.post(`order/delete`, data).subscribe(
      res => {
        // this.dataArray = this.dataArray.filter(data => data['instance_id'] === product_instance_id && number-- > 0);
        // this.cartItems.next(this.dataArray.length);
        this.loadOrderlines();
        if (res.n <= 0 && res.nModified <= 0)
          return cb ? cb('nothing is changed') : null;

        if (cb) cb(null);
      }, err => {
        console.error("error in removing orderline", err);
        if (cb) cb(err);
      }
    );
  }

  getTotalNumber() {
    let counter = 0;
    this.dataArray.forEach(elem => counter += elem['quantity'] || 0);
    return counter;
  }

  getReformedOrderlines() {
    if (this.dataArray.length <= 0 ||
      (this.dataArray && this.dataArray.length === 1 && !this.dataArray[0]['product_id']))
      return null;

    return this.dataArray.map(el => {
      return Object.assign({
        cost: el.instance_price ? el.instance_price : el.base_price,
        product_color_id: el.color ? el.color.id : null,
        color: (el.color && el.color.name) || 'defaultColor',
      }, el);
    });
  }

  getBalanceAndLoyalty(cb = null) {
    this.httpService.get(`customer/balance`).subscribe(
      data => {
        if (cb) cb(data['balance'], data['loyalty_points']);
      },
      err => {
        if (cb) cb(0, 0);
      }
    );
  }

  addCoupon(coupon_code = '') {
    if (coupon_code.length <= 0)
      return Promise.resolve(false);

    return new Promise((resolve, reject) => {
      if (this.dataArray && this.dataArray.length > 0)
        this.httpService.post('coupon/code/valid', {
          product_ids: Array.from(new Set(this.dataArray.map(el => el.product_id.toString()))),
          coupon_code: coupon_code,
        }).subscribe(
          (data) => {
            data = data[0];
            const someItems = this.dataArray.filter(el => el.product_id.toString() === data.product_id.toString());
            if (someItems && someItems.length > 0) {
              someItems.forEach(el => {
                el['coupon_discount'] = 1 - data.discount;
              });

              // let semiTotalPrice = someItems.map(el => (el.instance_price || el.base_price) * el.quantity);
              // if(semiTotalPrice)
              //   semiTotalPrice = semiTotalPrice.reduce((a, b) => a + b);
              // this.coupon_discount = semiTotalPrice - (semiTotalPrice * data.discount);
              resolve(true);
            } else
              reject({});
          },
          (err) => {
            reject(err);
          });
    });
  }
}
