import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

interface Product {
  //for now, only name and cost
  name: string;
  cost: number;
}

@Component({
  selector: 'page-bag',
  templateUrl: 'bag.html',
})
export class BagPage {
  products: Product[] = [];
  isPromoCodeShown: Boolean = false;
  shippingCost: number = 0;
  estimatedTax: number = 0;

  constructor(public navCtrl: NavController) {

  }

  onClickedOnPromoCode() {
    this.isPromoCodeShown = !this.isPromoCodeShown;
  }

  getSubtotalCost() {
    let cost = 0;
    for(let p in this.products) {
      cost += this.products[p].cost;
    }
    return cost;
  }

  getTotalCost() {
    let cost = this.getSubtotalCost();
    cost += this.shippingCost + this.estimatedTax;
    return cost;
  }

}
