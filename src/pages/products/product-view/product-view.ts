import {Component, ViewChild} from "@angular/core";
import {
  NavController, NavParams, PopoverController, Slides,
  ViewController
} from "ionic-angular";
import {HttpService} from "../../../services/http.service";
import {ProductDetailPage} from "../product-detail/product-detail";
import {SelectSizePage} from "../select-size/select-size";
import {priceFormatter} from "../../../shared/lib/priceFormatter";

@Component({
  selector: 'page-product-view',
  templateUrl: 'product-view.html',
})
export class ProductViewPage {

  @ViewChild('topSlider') topSlider: Slides;

  tempImageUrl = '../assets/imgs/shoeSample.png';
  productId: string;
  HOST: string;
  currentProduct: {};
  selectedColor: {};
  activeColorIndex: number = 0;
  thumbnails = [];

  buyButtonShouldBeActive: Boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, private httpService: HttpService,
              private popoverCtrl: PopoverController) {
    this.HOST = HttpService.Host;
    //TODO: TEST ONLY -> REMOVE FOLLOWING LINE TO WORK WITH THE SERVER!
    // this.HOST = '';
  }

  ionViewDidLoad() {
    this.productId = this.navParams.get('productId');
    this.httpService.get(`product/${this.productId}`).subscribe(
      data => {
        this.currentProduct = data;
        if (this.currentProduct && this.currentProduct['colors']) {
          this.selectedColor = this.currentProduct['colors'][0];

          //set first of each color to show in the horizontal scroll section
          this.thumbnails = [];
          this.currentProduct['colors'].forEach((elem, idx) => {
            this.thumbnails.push({
              index: idx,
              image: elem.image.thumbnail,
            });
          });
        }
      }
    );
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('بازگشت');
  }

  changeColorTo(index) {
    if (this.currentProduct) {
      if (this.currentProduct['colors']) {
        if (this.currentProduct['colors'].length > index) {
          this.selectedColor = this.currentProduct['colors'][index];
          this.topSlider.slideTo(0);
          this.activeColorIndex = index;
          this.checkBuyButton();
          return;
        }
      }
    }
    this.activeColorIndex = 0;
  }

  checkBuyButton() {
    let anyProductExist = false;
    this.currentProduct['instances'].some(instance => {
      if (this.currentProduct['colors'][this.activeColorIndex]._id === instance.product_color_id) {
        anyProductExist = true;
        return true;
      }
    });
    this.buyButtonShouldBeActive = anyProductExist;
  }

  goToDetail() {
    this.navCtrl.push(ProductDetailPage, {
      details: this.currentProduct['details'] ? this.currentProduct['details'] : null
    });
  }

  presentPopOver(myEvent) {
    let pop = this.popoverCtrl.create(SelectSizePage, {
      productId: this.productId,
      instances: (this.currentProduct && this.currentProduct['instances']) ?
        this.currentProduct['instances'] : null,
      // activeColor: {_id:'5a9cf71a68b68c2897d1924f'}
      activeColor: (this.currentProduct && this.currentProduct['colors'] && this.currentProduct['colors'].length > this.activeColorIndex) ?
        this.currentProduct['colors'][this.activeColorIndex] : null
    }, {
      cssClass: 'select-size-popover'
    });

    pop.present({ev: myEvent});
  }

  formatPrice(p) {
    return priceFormatter(p);
  }

}
