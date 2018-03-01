import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavController, NavParams, ViewController} from 'ionic-angular';
import {ProductService} from '../../services/productService';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  collectionDetails = {
    nameFa: 'تازه های مردانه',
    name: 'men-shoes',
  };
  productsCount = 0;
  pageName = null;
  collectionId = null;
  products = [];
  types = [{
    name_en: 'men',
    name_fa: 'مردانه',
  }, {
    name_en: 'women',
    name_fa: 'زنانه',
  }, {
    name_en: 'boys',
    name_fa: 'پسرانه',
  }, {
    name_en: 'girls',
    name_fa: 'دخترانه',
  }];
  curType = 'All';


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private productService: ProductService, public viewCtrl: ViewController,
              private httpService: HttpService) {
  }

  ngOnInit() {
    this.navBar.setBackButtonText('بازگشت');

    // Get sub-collection
    this.httpService.post('page/placement/list', {
      address: this.navParams.get('typeName') + '/' + this.curType,
    }).subscribe(
      (data) => {
        console.log('sub-collection: ', data);
        // Should get placements from placementService
        this.types = data;
      },
      (err) => {
        console.error('Cannot get types for specific collection: ', err);
      }
    );

    this.pageName = this.navParams.get('typeName') + '/' + this.curType;
    this.collectionId = this.navParams.get('collectionId');
    this.collectionId = '5a96b7604df3c90a10be4238';
    this.productService.loadProducts(this.collectionId);

    this.productService.productList.subscribe(
      (data) => {
        this.products = data;
        this.productsCount = this.products ? this.products.length : 0;
      },
      (err) => {
        console.error('Error when subscribing on productList: ', err);
      }
    );
  }

  loadOtherProducts(infiniteScroll) {
    this.productService.getProducts(this.productsCount, 10);

    if (this.productsCount === this.products.length)
      infiniteScroll.enable(false);
    else
      this.productsCount = this.products.length;

    infiniteScroll.complete();
  }

  toProductDetails(id) {
    console.log(id);
  }

  typeChanged(data) {
    this.curType = data._value;
    this.pageName = 'collection/' + this.curType;
    this.productService.loadProducts(this.pageName);
  }
}
