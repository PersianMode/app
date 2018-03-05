import {Component} from "@angular/core";
import {NavController, NavParams, ToastController, ViewController} from "ionic-angular";
import {priceFormatter} from "../../../shared/lib/priceFormatter";

@Component({
  selector: 'page-select-size',
  templateUrl: 'select-size.html',
})
export class SelectSizePage {

  instances = [];
  rows = [];

  selectedSize = null;
  activeColor = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private toastCtrl: ToastController) {
    if(this.navParams.get('instances') == null) {
      this.presentToast();
      return;
    }
    this.instances = this.navParams.get('instances');
    this.activeColor = this.navParams.get('activeColor');
    this.getSeparatedRowProducts(6);
  }

  addToBag() {
    console.log("product information: ", this.activeColor, this.instances[this.selectedSize]);
  }

  selectSize(index = null) {
    this.selectedSize = index;
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'An error occurred',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  getSeparatedRowProducts(s = 6) {
    let total = [];
    let chunk = [];
    let i;
    for(i = 0; i < this.instances.length; i++) {
      chunk.push(this.instances[i]);
      if(i % s == s-1 && i != 0) {
        total.push(chunk);
        chunk = [];
      }
    }
    total.push(chunk);
    this.rows = total;
  }

  formatNumber(p) {
    //HAS BUGS!
    // return priceFormatter(p);
    return p;
  }

}
