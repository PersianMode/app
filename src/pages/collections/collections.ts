import {Component, ViewChild} from "@angular/core";
import {LoadingController, Navbar, NavController, NavParams} from "ionic-angular";
import {FilterPage} from "../filter/filter";
import {ProductService} from "../../services/productService";
import {ProductViewPage} from "../products/product-view/product-view";
import {SearchPage} from '../search/search';


@Component({
  selector: "page-collection",
  templateUrl: "collections.html",
})
export class CollectionsPage {
  loading: any;
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
    private productService: ProductService,
    private loadingCtrl: LoadingController) {

  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create({});
    this.navBar.setBackButtonText("بازگشت");
    
    this.loading.present().then(() => {

      this.products$ = this.productService.productList$.subscribe(
        (data) => {
          this.totalProducts = data;
          this.products = this.totalProducts.slice(0, this.countPerScroll);
          this.loading.dismiss().catch(err => {
            console.error('-> ', err);
          });
        }, err => {
          this.loading.dismiss().catch(err => {
            console.error('-> ', err);
          });
        });
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
    this.products$.unsubscribe();
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }
}
