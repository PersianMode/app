import {Component, EventEmitter, Input, Output} from "@angular/core";
import {LoadingController, PopoverController} from "ionic-angular";
import {SelectCount} from "../select-count/select-count";
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'page-product-sliding',
  templateUrl: 'product-sliding.html'
})
export class ProductSliding {
  // TODO: this whole product-slide must be for one product and should be '*ngFor'ed in 'bag.ts'. this way we don't need to have two-way data-binding or something
  @Input() products;
  @Output() getList = new EventEmitter<any>();

  constructor(public loadingCtrl: LoadingController, public popoverCtrl: PopoverController,
              private cartService: CartService) {

  }

  removeThisProduct(product) {
    let loading = this.loadingCtrl.create({
      duration: 1000,
    });
    setTimeout(() => {
      this.cartService.removeOrderline(product.instance_id, product.quantity, (err) => {
        if(err) {
          console.log("error in removing orderline", err);
          return;
        }

        // TODO: working on it
        this.getList.emit();
        // this.products = this.products.filter(el => el.product_color_id !== product.product_color_id);

      });
    }, 200);
    loading.present();
  }

  actionCount() {
    let overCtrl = this.popoverCtrl.create(SelectCount, {
      count: 10
    });
    overCtrl.present();
  }
}
