import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PopoverController, AlertController, NavController} from "ionic-angular";
import {SelectCount} from "../select-count/select-count";
import {CartService} from "../../../services/cart.service";
import {priceFormatter} from "../../../shared/lib/priceFormatter";
import {imagePathFixer} from "../../../shared/lib/imagePathFixer";
import {LoadingService} from "../../../services/loadingService";
import {ProductViewPage} from '../../products/product-view/product-view';

@Component({
  selector: "page-product-sliding",
  templateUrl: "product-sliding.html"
})
export class ProductSliding implements OnInit {
  @Input() product;
  @Output() getList = new EventEmitter<any>();

  constructor(public loadingService: LoadingService, private cartService: CartService,
              private alertCtrl: AlertController, public popoverCtrl: PopoverController,
              private navCtrl: NavController) {
  }

  ngOnInit() {
  }

  removeThisProduct() {
    this.alertCtrl.create({
      title: 'تأیید حذف',
      subTitle: 'آیا می خواهید این محصول را از سبد خرید حذف کنید؟',
      buttons: [
        {
          text: 'خیر',
        },
        {
          text: 'حذف',
          handler: () => {
            this.loadingService.enable({duration: 1000}, 200, () => {
              this.cartService.removeOrderline(this.product.instance_id, this.product.quantity)
                .then(res => {
                  this.getList.emit();
                  this.loadingService.disable();
                })
                .catch(err => {
                  console.error("error in removing orderling", err);
                  this.loadingService.disable();
                });
            });
          }
        }
      ]
    }).present();
  }

  actionCount() {
    let overCtrl = this.popoverCtrl.create(SelectCount, {
      count: this.product.count >= 10 ? 10 : this.product.count,
      quantity: this.product.quantity || 1,
      product_id: this.product.product_id,
      product_instance_id: this.product.instance_id,
    });
    overCtrl.present();
    overCtrl.onDidDismiss(() => {
      this.getList.emit();
    })
  }

  getMaxCount() {
    return (this.product.count >= 10 ? 10 : this.product.count);
  }

  formatPrice(p) {
    return priceFormatter(p);
  }

  getThumbnailURL(): string {
    return imagePathFixer(this.product.color.image.thumbnail, this.product.product_id, this.product.color._id);
  }

  getProductDiscount() {
    if (this.product.discount)
      return this.product.cost - (this.product.cost * this.product.discount);
    return 0;
  }

  goToProductViewPage() {
    this.navCtrl.push(ProductViewPage, {productId: this.product.product_id});
  }
}
