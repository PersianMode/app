import {Component, ViewChild} from '@angular/core';
import {Navbar, NavController, NavParams, ToastController} from 'ionic-angular';
import {FilterPage} from '../filter/filter';
import {PageService} from '../../services/page.service';
import {ProductService} from '../../services/productService';
import {ProductViewPage} from '../products/product-view/product-view';


@Component({
  selector: 'page-collection',
  templateUrl: 'collections.html',
})
export class CollectionsPage {
  @ViewChild(Navbar) navBar: Navbar;
  productsCount = 0;
  pageName = null;
  address;
  products$: any;
  products: any[];
  collectionName;
  totalProducts = [];
  countPerScroll = 20;
  cScrollIndex = 0;
  scrollCounter = 0;


  constructor(public navCtrl: NavController, public navParams: NavParams, private  productService: ProductService, private toastCtrl: ToastController) {
  }


  ionViewWillEnter() {

    this.navBar.setBackButtonText('بازگشت');
    this.products$ = this.productService.productList$.subscribe(
      (data) => {
        this.totalProducts = data;
        this.products = this.totalProducts.slice(0, this.countPerScroll)
      });

    this.productService.collectionNameFa$.subscribe(res => {
      this.collectionName = res;
    });

  }
  ionViewDidLoad(){
    this.address = this.navParams.get('address');
    this.productService.loadProducts(this.address);
  }

  loadOtherProducts(infiniteScroll) {
    this.scrollCounter++;

    this.cScrollIndex = this.countPerScroll * this.scrollCounter;

    if (this.products.length !== this.totalProducts.length) {
      this.products = this.products.concat(this.totalProducts.slice(this.cScrollIndex - 1, this.cScrollIndex - 1 + this.countPerScroll));
      infiniteScroll.complete();
    }
  }

  toProductDetails(id) {
    this.navCtrl.push(ProductViewPage, {productId: id})
  }

  gotToProductFilter() {
    this.navCtrl.push(FilterPage)
  }

  ionViewWillLeave() {

    this.products$.unsubscribe();

  }

}
