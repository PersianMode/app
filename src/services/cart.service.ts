import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Storage} from '@ionic/storage';

@Injectable()
export class CartService {
  cnt = 0;

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
          data => {
            if (!(data.n > 0 || data.nModified > 0))
              return cb('nothing is changed');

            if (cb) cb(null);
          }, err => {
            console.log('error in adding orderline', err);
            if (cb) cb(err);
          }
        );
      });
  }

  // getCartItems() {
  //   if (!this.authService.isLoggedIn.getValue()) {
  //     this.getCartFromStorage();
  //   }

  // Get order-line details or all order details
// }

  getCartFromStorage() {
    return JSON.parse(localStorage.getItem('cart')) === null ? [] : JSON.parse(localStorage.getItem('cart'));
  }
}
