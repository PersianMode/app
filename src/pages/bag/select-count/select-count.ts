import {Component} from "@angular/core";
import {LoadingController, NavController, NavParams} from "ionic-angular";
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'page-select-count',
  templateUrl: 'select-count.html'
})
export class SelectCount {
  product_id;
  product_instance_id;

  count;
  countArray;

  quantity;
  selectedQuantity;

  loading;


  constructor(public navParams: NavParams, private cartService: CartService,
              private loadingCtrl: LoadingController, private navCtrl: NavController) {
    this.count = this.navParams.get('count');
    this.countArray = Array.apply(null, Array(this.count)).map((el, i) => i + 1);

    this.quantity = this.navParams.get('quantity');
    this.selectedQuantity = this.quantity;

    this.product_id = this.navParams.get('product_id');
    this.product_instance_id = this.navParams.get('product_instance_id');
    console.log(this.quantity, this.countArray);
  }

  // TODO: problems:
  // not instantly updating the product-sliding quantity
  // The top button should be fixed, not floated

  applyChangedQuantity() {
    let diff = this.selectedQuantity - this.quantity;
    this.presentLoading(true);
    if(diff > 0) {
      this.cartService.addOrderline(this.product_id, this.product_instance_id, diff, () => {
        this.loading.dismiss();
        this.presentLoading(false);
      });
    }
    else {
      this.cartService.removeOrderline(this.product_instance_id, -diff, () => {
        this.loading.dismiss();
        this.presentLoading(false);
      });
    }
  }

  presentLoading(isLoading = false) {
    if(isLoading) {
      this.loading = this.loadingCtrl.create({
      });
    }
    else {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'تعداد با موفقیت تغییر کرد.',
        duration: 1000,
        cssClass: 'select-size-page-header',
      });
    }
    this.loading.present();

    this.loading.onDidDismiss(() => {
      if(!isLoading)
        this.navCtrl.pop();
    })
  }
}
