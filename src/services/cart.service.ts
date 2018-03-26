import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class CartService {
  dataArray: any = [];
  cartItems: ReplaySubject<number> = new ReplaySubject<number>();

  constructor(private httpService: HttpService) {
    this.loadOrderlines();
  }

  loadOrderlines() {
    this.httpService.post(`cart/items`, {data: {}}).subscribe(
      data => {
        console.log(data);
        this.dataArray = data;
        this.cartItems.next(this.getTotalNumber());
      }, err => {
        console.log("err", err);
      }
    );
  }

  addOrderline(product_id, product_instance_id, number, cb) {
    let data = {product_id, product_instance_id, number};
    this.httpService.post(`order`, data).subscribe(
      res => {
        this.dataArray.push({
          instance_id: product_instance_id,
          quantity: number,
        });
        this.cartItems.next(this.getTotalNumber());
        if (!(res.n > 0 || res.nModified > 0))
          return cb('nothing is changed');

        if (cb) cb(null);
      }, err => {
        console.log('error in adding orderline', err);
        if (cb) cb(err);
      }
    );
  }

  removeOrderline(product_instance_id, number, cb) {
    number = number || -1;
    let data = {product_instance_id, number};
    this.httpService.post(`order/delete`, data).subscribe(
      res => {
        this.dataArray = this.dataArray.filter(data => data['instance_id'] === product_instance_id && number-- > 0);
        this.cartItems.next(this.dataArray.length);
        if (!(res.n > 0 || res.nModified > 0))
          return cb ? cb('nothing is changed') : null;

        if (cb) cb(null);
      }, err => {
        console.log("error in removing orderline", err);
        if (cb) cb(err);
      }
    );
  }

  getTotalNumber() {
    let counter = 0;
    this.dataArray.forEach(elem => {
      counter += elem['quantity'];
    });
    return counter;
  }

  getReformedOrderlines() {
    return this.dataArray.map(el => {
      return {
        product_id: el.product_id ? el.product_id : null,
        instance_id: el._id ? el._id : null,
        name: el.name ? el.name : null,
        cost: el.base_price ? el.base_price : null, // TODO: discounts should be considered here
        product_color_id: el.color ? el.color.id : null,
        thumbnail: el.thumbnail,
        color: 'temp', // TODO: no such color element is received from server
        size: el.size,
        quantity: el.quantity
      }
    });
  }

}
