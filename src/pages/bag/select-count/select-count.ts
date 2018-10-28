import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {CartService} from "../../../services/cart.service";
import {LoadingService} from "../../../services/loadingService";

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
    private loadingService: LoadingService, private navCtrl: NavController) {
    this.count = this.navParams.get('count');
    this.countArray = Array.apply(null, Array(this.count)).map((el, i) => i + 1);

    this.quantity = this.navParams.get('quantity');
    this.selectedQuantity = this.quantity;

    this.product_id = this.navParams.get('product_id');
    this.product_instance_id = this.navParams.get('product_instance_id');
  }

  applyChangedQuantity() {
    let diff = this.selectedQuantity - this.quantity;
    this.loadingService.enable();
    if (diff > 0) {
      this.cartService.addOrderline(this.product_id, this.product_instance_id, diff)
        .then(res => {
          this.loadingService.disable();
          this.loadingService.enable({
            spinner: 'hide',
            content: 'تعداد با موفقیت تغییر کرد.',
            duration: 1000,
            cssClass: 'select-size-page-header',
          });
          this.loadingService.setOnDismissFunctionality(() => {
            this.navCtrl.pop();
          });
        })
        .catch(err => {
          console.error('Error: ', err);
        });
    }
    else {
      this.cartService.removeOrderline(this.product_instance_id, -diff)
        .then(res => {
          this.loadingService.enable({
            spinner: 'hide',
            content: 'تعداد با موفقیت تغییر کرد.',
            duration: 1000,
            cssClass: 'select-size-page-header',
          });
          this.loadingService.setOnDismissFunctionality(() => {
            this.navCtrl.pop();
          });
        })
        .catch(err => {
          console.error('Error: ', err);
        });
    }
  }
}
