import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavController, NavParams, ViewController} from 'ionic-angular';
import {ProductService} from '../../services/productService';
import {FilterPage} from '../filter/filter';

@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  productsCount = 0;
  pageName = null;
  products = [];


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private productService: ProductService) {
  }

  ngOnInit() {
    this.navBar.setBackButtonText('بازگشت');

    let address = this.navParams.get('address');

    if (address) {


      // this.productService.loadProducts(address);
      // this.productService.productList$.subscribe(
      //   (data) => {
      //     this.products = data;
      //     this.productsCount = this.products ? this.products.length : 0;
      //   },
      //   (err) => {
      //     console.error('Error when subscribing on productList: ', err);
      //   }
      // );
      // this.productService.collectionInfo$.subscribe(res => {
      //   this.pageName = res;
      //   },err => {
      //     console.error('Error when subscribing on collection info: ', err);
      //
      //   } )

    }
  }

  loadOtherProducts(infiniteScroll) {
    //this.productService.getProducts(this.productsCount, 10);

    if (this.productsCount === this.products.length)
      infiniteScroll.enable(false);
    else
      this.productsCount = this.products.length;

    infiniteScroll.complete();
  }

  toProductDetails(id) {
    console.log(id);
  }

  // typeChanged(data) {
  //   this.curType = data._value;
  //   this.pageName = 'collection/' + this.curType;
  //   this.productService.loadProducts(this.pageName);
  // }

  gotToProductFilter() {
    this.navCtrl.push(FilterPage)
  }
}
