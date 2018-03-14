import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {CartService} from "../../services/cart.service";

interface Product {
  //for now, only name and cost
  name: string;
  cost: number;
  product_color_id: string
  thumbnail: string,
}

@Component({
  selector: 'page-bag',
  templateUrl: 'bag.html',
})
export class BagPage {
  products: Product[] = [{
    name: 'محصول ۱',
    cost: 1000,
    product_color_id: '5a9cf71a68b68c2897d19253',
    thumbnail: 'assets/product-pic/13.jpg'

  }, {
    name: 'محصول ۱',
    cost: 1500,
    product_color_id: '5a9cf71a68b68c2897d1924f',
    thumbnail: 'assets/product-pic/12.jpg'
  }, {
    name: 'محصول ۲',
    cost: 2000,
    product_color_id: '5a9cf71a68b68c2897d19251',
    thumbnail: 'assets/product-pic/11.jpg'

  }, {
    name: 'محصول ۳',
    cost: 3000,
    product_color_id: '5a9cf71a68b68c2897d19252',
    thumbnail: 'assets/product-pic/10.jpg'
  }];
  isPromoCodeShown: Boolean = false;
  shippingCost: number = 0;
  estimatedTax: number = 0;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
              private cartService: CartService) {

  }

  ngOnInit() {
    this.cartService.loadOrderlines();
  }



  onClickedOnPromoCode() {
    this.isPromoCodeShown = !this.isPromoCodeShown;
    this.cartService.loadOrderlines();
  }

  getSubtotalCost() {
    let cost = 0;
    for (let p in this.products) {
      cost += this.products[p].cost;
    }
    return cost;
  }

  getTotalCost() {
    let cost = this.getSubtotalCost();
    cost += this.shippingCost + this.estimatedTax;
    return cost;
  }

  removeThisProduct(product) {
    let loading = this.loadingCtrl.create({
      duration: 2000,
    });
    setTimeout(() => {
      this.products = this.products.filter(el => el.product_color_id !== product.product_color_id)
    }, 1000);
    loading.present();
  }

}
