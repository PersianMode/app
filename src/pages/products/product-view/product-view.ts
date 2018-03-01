import {Component, ViewChild} from "@angular/core";
import {
  NavController, NavParams, PopoverController, Slides,
  ViewController
} from "ionic-angular";
import {HttpService} from "../../../services/http.service";
import {ProductDetailPage} from "../product-detail/product-detail";
import {SelectSizePage} from "../select-size/select-size";

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
  activeColorIndex: Number = 0;
  firstOfEachColor = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, private httpService: HttpService,
              private popoverCtrl: PopoverController) {
    this.HOST = HttpService.HOST;
  }

  ionViewDidLoad() {
    this.productId = this.navParams.get('productId');
    this.httpService.get(`product/${this.productId}`).subscribe(
      data => {
        data = data.body[0];
        this.currentProduct = data;
        if(this.currentProduct && this.currentProduct['colors']) {
          this.selectedColor = this.currentProduct['colors'][0];

          //set first of each color to show in the horizontal scroll section
          this.firstOfEachColor = [];
          this.currentProduct['colors'].forEach((elem, idx) => {
            this.firstOfEachColor.push({
              index: idx,
              image: elem.images[0],
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
    if(this.currentProduct) {
      if(this.currentProduct['colors']) {
        if(this.currentProduct['colors'].length > index) {
          this.selectedColor = this.currentProduct['colors'][index];
          this.topSlider.slideTo(0);
          this.activeColorIndex = index;
          return;
        }
      }
    }
    this.activeColorIndex = 0;
  }

  goToDetail() {
    this.navCtrl.push(ProductDetailPage, {
      details: this.currentProduct['details'] ? this.currentProduct['details'] : null
    });
  }

  presentPopOver(myEvent) {
    let pop = this.popoverCtrl.create(SelectSizePage, {
      instances: (this.currentProduct && this.currentProduct['instances']) ? this.currentProduct['instances'] : null
    }, {
      cssClass: 'select-size-popover'
    });

    pop.present({ev: myEvent});
  }

}
