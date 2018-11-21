import {Component, ViewChild} from "@angular/core";
import {
  NavController, NavParams, PopoverController, Slides,
  ViewController,
  Navbar
} from "ionic-angular";
import {ProductDetailPage} from "../product-detail/product-detail";
import {ProductService} from '../../../services/productService';
import {priceFormatter} from '../../../shared/lib/priceFormatter';
import {SelectSizePage} from '../select-size/select-size';
import {SearchPage} from '../../search/search';
import {SocialSharing} from '@ionic-native/social-sharing';
import {HttpService} from "../../../services/http.service";

@Component({
  selector: 'page-product-view',
  templateUrl: 'product-view.html',
})
export class ProductViewPage {
  productId: string;

  @ViewChild('topSlider') topSlider: Slides;
  @ViewChild(Navbar) navBar: Navbar;

  product: any;
  product$: any;

  selectedColor: any;
  activeColorIndex: number = 0;
  thumbnails: string[] = [];
  buyButtonShouldBeActive: Boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private productService: ProductService,
    private popoverCtrl: PopoverController, private socialSharing: SocialSharing) {

  }

  ionViewWillEnter() {
    this.navBar.setBackButtonText('');
    this.productId = this.navParams.get('productId');

    this.productService.getProduct(this.productId);


    this.product$ = this.productService.product$.subscribe(data => {

      this.thumbnails = [];
      this.product = data;
      this.selectedColor = this.product.colors[0];
      this.product.colors.forEach(color => {
        this.thumbnails.push(color.image.thumbnail);
      })

      this.checkBuyButton();
    });


  }

  changeColorTo(index) {
    this.selectedColor = this.product.colors[index];
    this.topSlider.slideTo(0);
    this.activeColorIndex = index;
    this.checkBuyButton();
  }


  checkBuyButton() {
    let anyProductExist = false;

    this.product['instances'].some(instance => {
      if (this.product['colors'][this.activeColorIndex]._id === instance.product_color_id) {
        anyProductExist = true;
        return true;
      }
    });
    this.buyButtonShouldBeActive = anyProductExist;
  }

  goToDetail() {
    this.navCtrl.push(ProductDetailPage, {
      details: this.product['details']
    });
  }


  presentPopOver(myEvent) {
    let pop = this.popoverCtrl.create(SelectSizePage, {
      productId: this.product ? this.product._id : null,
      activeColor: (this.product && this.product['colors'] && this.product['colors'].length > this.activeColorIndex) ?
        this.product['colors'][this.activeColorIndex]._id : null
    }, {
        cssClass: 'select-size-popover'
      });

    pop.present({ev: myEvent});
  }

  formatPrice(p) {
    return priceFormatter(p);
  }

  ionViewWillLeave() {
    this.product$.unsubscribe();
    this.product = null;
    this.thumbnails = [];
    this.selectedColor = null;
    this.activeColorIndex = 0;
  }

  getImages() {
    return this.selectedColor ? this.selectedColor['image']['angles'].map(x => x.url) : null;
  }

  getPrice() {
    if (this.product) {
      const inst = this.product.instances.find(el => el.product_color_id === this.selectedColor._id);

      if (inst && inst.price)
        return inst.price;
      return this.product.base_price;
    }
  }

  getPriceDiscount() {
    const inst = this.product.instances.find(el => el.product_color_id === this.selectedColor._id);
    return (inst && inst.price ? inst.price : this.product.base_price) - ((inst && inst.price ? inst.price : this.product.base_price) * this.product.discount);
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  shareProduct() {
    if (this.product) {
      this.socialSharing.share('محصول ' + this.product.name, 'محصولات پرشین مد', null, HttpService.Host + '/product/' + this.product.id + '/' + this.selectedColor);
    }
  }
}
