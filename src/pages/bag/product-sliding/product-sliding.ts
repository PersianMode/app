import {Component, Input} from '@angular/core';
import {ActionSheetController, LoadingController, PopoverController} from 'ionic-angular';
import {SelectCount} from '../select-count/select-count';

@Component({
  selector: 'page-product-sliding',
  templateUrl: 'product-sliding.html'
})

export class ProductSliding {
  @Input() products;

  constructor(public loadingCtrl: LoadingController,public popoverCtrl: PopoverController) {

  }

  removeThisProduct(product) {
    let loading = this.loadingCtrl.create({
      duration: 1000,
    });
    setTimeout(() => {
      this.products = this.products.filter(el => el.product_color_id !== product.product_color_id)
    }, 500);
    loading.present();
  }

  actionCount(){
    let overCtrl = this.popoverCtrl.create(SelectCount,{
      count: 10
    });
    overCtrl.present();

  }
}
