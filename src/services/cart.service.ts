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



}
