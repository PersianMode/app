import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Storage} from '@ionic/storage';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class CartService {
  dataArray: any = [];
  cartItems: ReplaySubject<number> = new ReplaySubject<number>();

  constructor(private httpService: HttpService,
              private storage: Storage) {
    console.log("hi");
    this.loadOrderlines();
  }

  loadOrderlines() {
    console.log("your init");
    this.storage.get('user')
      .then(user => {
        if(!user) {
          return;
        }

        this.httpService.post(`cart/items`, {data: {}}).subscribe(
          data => {
            console.log("data", data);
          }, err => {
            console.log("err", err);
          }
        );
      })
      .catch(err => {
        console.log("outer err", err);
      })
  }

  addOrderline(product_instance_id, number, cb) {
    this.storage.get('user')
      .then(user => {
        if (!user) {
          if (cb) cb('not logged in');
          return;
        }
        let customer_id = user['id'] || null;
        let data = {customer_id, product_instance_id, number};
        this.httpService.post(`order`, data).subscribe(
          res => {
            this.dataArray.push(data);
            this.cartItems.next(this.dataArray.length);
            if (!(res.n > 0 || res.nModified > 0))
              return cb('nothing is changed');

            if (cb) cb(null);
          }, err => {
            console.log('error in adding orderline', err);
            if (cb) cb(err);
          }
        );
      });
  }

  removeOrderline(product_instance_id, number, cb) {
    this.storage.get('user')
      .then(user => {
        if(!user) {
          if(cb) cb('not logged in');
          return;
        }
        let customer_id = user['id'] || null;
        number = number || -1;
        let data = {customer_id, product_instance_id, number};
        this.httpService.post(`order`, data).subscribe(
          res => {
            this.dataArray = this.dataArray.filter(data => data['product_instance_id'] === product_instance_id && number-- > 0);
            this.cartItems.next(this.dataArray.length);
            if(!(res.n > 0 || res.nModified > 0))
              return cb ? cb('nothing is changed') : null;

            if(cb) cb(null);
          }, err => {
            console.log("error in removing orderline", err);
            if(cb) cb(err);
          }
        );
      })
  }



}
