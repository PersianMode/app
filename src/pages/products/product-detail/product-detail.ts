import {Component} from "@angular/core";
import {NavController, NavParams, ViewController} from "ionic-angular";

@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  details;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.details = this.navParams.get('details');
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('بازگشت');
  }

}
