import {Component, ViewChild} from "@angular/core";
import {
  NavController, NavParams, PopoverController, Slides,
  ViewController
} from "ionic-angular";
import {ProductDetailPage} from "../product-detail/product-detail";
import {SelectSizePage} from "../select-size/select-size";
import {priceFormatter} from "../../../shared/lib/priceFormatter";
import {ProductService} from '../../../services/productService';

@Component({
  selector: 'page-product-view',
  templateUrl: 'product-view.html',
})
export class ProductViewPage {
  productId: string;

  @ViewChild('topSlider') topSlider: Slides;

  product: any;
  product$: any;

  selectedColor: string;
  activeColorIndex: number = 0;

  buyButtonShouldBeActive: Boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, private productService: ProductService,
              private popoverCtrl: PopoverController) {

  }

  ionViewDidLoad() {
    this.productId = this.navParams.get('productId');


    this.productService.getProduct(this.productId);

    this.product$ = this.productService.product$.subscribe(data => {

      this.product  = data;
      console.log('-> ',this.product);
    });





    // this.httpService.get(`product/${this.productId}`).subscribe(
    //   data => {
    //     this.currentProduct = data[0];
    //     if (this.currentProduct && this.currentProduct['colors']) {
    //       this.selectedColor = this.currentProduct['colors'][0];
    //
    //       //set first of each color to show in the horizontal scroll section
    //       this.thumbnails = [];
    //       this.currentProduct['colors'].forEach((elem, idx) => {
    //         this.thumbnails.push({
    //           index: idx,
    //           image: elem.image.thumbnail,
    //         });
    //       });
    //     }
    //   }
    // );
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('بازگشت');


  }

  // changeColorTo(index) {
  //   if (this.currentProduct) {
  //     if (this.currentProduct['colors']) {
  //       if (this.currentProduct['colors'].length > index) {
  //         this.selectedColor = this.currentProduct['colors'][index];
  //         this.topSlider.slideTo(0);
  //         this.activeColorIndex = index;
  //         this.checkBuyButton();
  //         return;
  //       }
  //     }
  //   }
  //   this.activeColorIndex = 0;
  // }
  //
  // checkBuyButton() {
  //   let anyProductExist = false;
  //   this.currentProduct['instances'].some(instance => {
  //     if (this.currentProduct['colors'][this.activeColorIndex]._id === instance.product_color_id) {
  //       anyProductExist = true;
  //       return true;
  //     }
  //   });
  //   this.buyButtonShouldBeActive = anyProductExist;
  // }
  //
  // goToDetail() {
  //   this.navCtrl.push(ProductDetailPage, {
  //     details: this.currentProduct['details'] ? this.currentProduct['details'] : null
  //   });
  // }
  //
  // presentPopOver(myEvent) {
  //   let pop = this.popoverCtrl.create(SelectSizePage, {
  //     instances: (this.currentProduct && this.currentProduct['instances']) ?
  //       this.currentProduct['instances'] : null,
  //     activeColor: (this.currentProduct && this.currentProduct['colors'] && this.currentProduct['colors'].length > this.activeColorIndex) ?
  //       this.currentProduct['colors'][this.activeColorIndex] : null
  //   }, {
  //     cssClass: 'select-size-popover'
  //   });
  //
  //   pop.present({ev: myEvent});
  // }
  //
  // formatPrice(p) {
  //   return priceFormatter(p);
  // }

  ionViewWillLeave(){
    this.product$.unsubscribe();
  }

}
