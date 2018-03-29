import {Component, EventEmitter, Input, Output} from "@angular/core";
import {LoadingController, PopoverController} from "ionic-angular";
import {SelectCount} from "../select-count/select-count";
import {CartService} from "../../../services/cart.service";
import {priceFormatter} from "../../../shared/lib/priceFormatter";

@Component({
  selector: 'page-product-sliding',
  templateUrl: 'product-sliding.html'
})
export class ProductSliding {
  @Input() product;
  @Output() getList = new EventEmitter<any>();

  constructor(public loadingCtrl: LoadingController, public popoverCtrl: PopoverController,
              private cartService: CartService) {
  }

  removeThisProduct() {
    let loading = this.loadingCtrl.create({
      duration: 1000,
    });
    setTimeout(() => {
      this.cartService.removeOrderline(this.product.instance_id, this.product.quantity)
        .then(res => {
          this.getList.emit();
        })
        .catch(err => {
          console.error("error in removing orderling", err);
        })
    }, 200);
    loading.present();
  }

  actionCount() {
    console.log("from here", this.product.quantity, this.product.count);

    // TODO: for test purposes, these following lines have been commented
    // if(this.product.count <= 1 && this.product.quantity <= 1) {
    //   return this.onNotHavingMoreThanOneQuantity();
    // }
    let overCtrl = this.popoverCtrl.create(SelectCount, {
      // TODO: because 'count' is always '0' at the moment, I hardcoded it to 10 for test purposes
      count: 10,//this.getMaxCount() || 1,
      quantity: this.product.quantity || 1,
      product_id: this.product.product_id,
      product_instance_id: this.product.instance_id,
    });
    overCtrl.present();
    overCtrl.onDidDismiss(() => {
      this.getList.emit();
    })
  }

  onNotHavingMoreThanOneQuantity() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'تعداد این محصول قابل تغییر نیست.',
      duration: 1000,
      cssClass: 'select-size-page-header',
    });
    loading.present();
  }

  getMaxCount() {
    return (this.product.count >= 10 ? 10 : this.product.count);
  }

  formatPrice(p) {
    return priceFormatter(p);
  }

}
