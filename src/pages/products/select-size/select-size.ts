import {Component} from "@angular/core";
import {LoadingController, NavController, NavParams, ToastController} from "ionic-angular";
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'page-select-size',
  templateUrl: 'select-size.html',
})
export class SelectSizePage {

  productId;
  instances = [];
  rows = [];
  selectedSize = null;
  activeColor = null;
  loading;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private toastCtrl: ToastController, private cartService: CartService,
              private loadingCtrl: LoadingController) {
    if(this.navParams.get('instances') == null) {
      this.presentToast('خطای وجود محصول');
      return;
    }
    this.productId = this.navParams.get('productId');
    this.instances = this.navParams.get('instances');
    this.activeColor = this.navParams.get('activeColor');
    this.getSeparatedRowProducts(6);
  }

  addToBag() {
    this.presentLoading(true);
    //this setTimeout is TEST-PURPOSE ONLY! to let us see the loading bar before adding the orderline
    setTimeout(() => {
      this.cartService.addOrderline(this.productId, this.instances[this.selectedSize]._id, 1, (err) => {
        if (err) {
          return this.presentToast("لطفا مجددا تلاش کنید");
        }

        this.loading.dismiss();
        this.presentLoading(false);
      });
    }, 200);
  }

  selectSize(index = null) {
    this.selectedSize = index;
  }

  presentLoading(isLoading = true) {
    if(isLoading) {
      this.loading = this.loadingCtrl.create({});
    }
    else {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'محصول به سبد خرید اضافه شد!',
        duration: 1500,
        cssClass: 'select-size-page-header',
      });
    }

    this.loading.present();

    this.loading.onDidDismiss(() => {
      if(!isLoading)
        this.navCtrl.pop();
    })
  }

  presentToast(message = 'خطا در انجام عملیات', position = 'bottom') {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position,
      cssClass: 'select-size-page-header',
    });

    if(this.loading)
      this.loading.dismiss();

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
