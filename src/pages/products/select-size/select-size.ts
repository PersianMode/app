import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {CartService} from "../../../services/cart.service";
import {ProductService} from '../../../services/productService';
import {ISize} from '../../../interfaces/isize.interface';
import {LoadingService} from "../../../services/loadingService";

@Component({
  selector: 'page-select-size',
  templateUrl: 'select-size.html',
})
export class SelectSizePage {

  productId;
  product$: any;
  product: any = null;
  sizes: ISize[] = [];
  selectedSize = null;
  activeColor = null;
  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController, private cartService: CartService,
    private loadingService: LoadingService, private productService: ProductService) {
  }

  ionViewWillEnter() {
    this.productId = this.navParams.get('productId');
    this.activeColor = this.navParams.get('activeColor');

    this.product$ = this.productService.product$.subscribe(res => {

      this.product = res;
      this.sizes = (this.product && this.product.sizesByColor) ?
        this.product.sizesByColor[this.activeColor] : null;
    });

    this.productService.getProduct(this.productId);

  }


  addToBag() {
    this.loadingService.enable();
    let foundInstance = this.product.instances.filter(x => x.product_color_id === this.activeColor && x.size === this.selectedSize)

    let instanceId = foundInstance && foundInstance[0] ? foundInstance[0]._id : null;

    if (instanceId) {
      this.cartService.addOrderline(this.productId, instanceId, 1)
        .then(res => {
          this.loadingService.disable();
          this.loadingService.enable({
            spinner: 'hide',
            content: 'محصول به سبد خرید اضافه شد!',
            duration: 1500,
            cssClass: 'select-size-page-header',
          });
          this.loadingService.setOnDismissFunctionality(() => {
            this.navCtrl.pop();
          });
        })
        .catch(err => {
          this.loadingService.disable();
          this.presentToast("لطفا مجدداً تلاش کنید!");
        })
    } else
      this.presentToast("محصول مورد نظر یافت نشد");

  }

  selectSize(size) {
    this.selectedSize = size;
  }

  presentLoading(isLoading = true) {
    if (isLoading) {
      this.loading = this.loadingCtrl.create({});
    }
    else {
      this.loading = this.loadingCtrl.create();
    }

    this.loading.present();

    this.loading.onDidDismiss()
  }

  presentToast(message = 'خطا در انجام عملیات', position = 'bottom') {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position,
      cssClass: 'select-size-page-header',
    });

    if (this.loading)
      this.loading.dismiss().catch(err => console.log('-> ', err));

    toast.present();
  }

  ionViewWillLeave() {
    this.product$.unsubscribe();
  }


}
