import {Component, ViewChild} from "@angular/core";
import {Navbar, NavController, NavParams} from "ionic-angular";
import {FilterPage} from "../filter/filter";
import {ProductService} from "../../services/productService";
import {ProductViewPage} from "../products/product-view/product-view";
import {SearchPage} from '../search/search';

@Component({
  selector: "page-collection",
  templateUrl: "collections.html",
})
export class CollectionsPage {
  @ViewChild(Navbar) navBar: Navbar;
  pageName = null;
  address;
  products$: any;
  products: any[];
  collectionName;
  totalProducts = [];
  countPerScroll = 20;
  cScrollIndex = 0;
  scrollCounter = 0;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private productService: ProductService) {

  }

  ionViewWillEnter() {
    this.productService.productList$.subscribe(
      (data) => {
        this.totalProducts = data;
        this.products = this.totalProducts.slice(0, this.countPerScroll);
      }, err => {
        console.error('Error when subscribing on productList: ', err);
      });


    this.productService.collectionNameFa$.subscribe(res => {
      this.collectionName = res;
      this.pageName = this.collectionName;
    });

  }

  ionViewDidLoad() {
    this.address = this.navParams.get("address");
    this.productService.loadProducts(this.address);
  }

  loadOtherProducts(infiniteScroll) {
    this.scrollCounter++;

    this.cScrollIndex = this.countPerScroll * this.scrollCounter;

    if (this.products.length !== this.totalProducts.length) {
      this.products = this.products.concat(this.totalProducts.slice(this.cScrollIndex - 1, this.cScrollIndex - 1 + this.countPerScroll));
    }

    infiniteScroll.complete();
  }

  toProductDetails(id) {
    this.navCtrl.push(ProductViewPage, {productId: id});
  }

  gotToProductFilter() {
    this.navCtrl.push(FilterPage);
  }

  ionViewWillLeave() {
    // this.products$.unsubscribe();
    this.products = [];
    this.totalProducts = [];
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }
}
