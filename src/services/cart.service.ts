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

  loadOrderlines(cb = null) {
    console.log("loadOrderlines");
    this.httpService.post(`cart/items`, {data: {}}).subscribe(
      data => {
        console.log("received data from loadOrderlines:", data);
        this.updateInfo(data);
        this.dataArray = data;
        if (cb) cb();
      }, err => {
        console.log("err", err);
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
        // console.log("response from deletion:", res);
        // this.dataArray = this.dataArray.filter(data => data['instance_id'] === product_instance_id && number-- > 0);
        // this.cartItems.next(this.dataArray.length);
        this.loadOrderlines();
        if (res.n <= 0 && res.nModified <= 0)
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
    this.dataArray.forEach(elem => counter += elem['quantity'] || 0);
    return counter;
  }

  getReformedOrderlines() {
    console.log("data array:", this.dataArray);
    if (this.dataArray.length <= 0 ||
      (this.dataArray && this.dataArray.length === 1 && !this.dataArray[0]['product_id']))
      return null;

    return this.dataArray.map(el => {
      let final_cost = el.instance_price || el.base_price || 0;
      el.discount.forEach(disc => final_cost *= disc);
      return Object.assign({}, el,{
        cost: el.instance_price ? el.instance_price : (el.base_price ? el.base_price : 0),
        final_cost: final_cost,
        product_color_id: el.color ? el.color.id : null,
        color: (el.color && el.color.name) || 'defaultColor',
      })
    });
  }

}
