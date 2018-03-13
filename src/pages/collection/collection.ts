import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavController, NavParams, ViewController} from 'ionic-angular';
import {ProductService} from '../../services/productService';
import {HttpService} from '../../services/http.service';
import {FilterPage} from '../filter/filter';

@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  collectionDetails = {
    nameFa: 'تازه های مردانه',
    name: 'men-shoes',
  };
  productsCount = 0;
  pageName = null;
  collectionId = null;
  // products = [{
  //   name: 'product 001',
  //   desc: 'description product 001',
  //   base_price: 1000,
  //   colors: [{
  //     color_id: '123',
  //     image:{
  //       thumbnail: 'assets/product-pic/thumbnail/09.jpg',
  //       angles: [{
  //         url: '',
  //       }]
  //     }
  //   }]
  // },{
  //   name: 'product 002',
  //   desc: 'description product 002',
  //   base_price: 2000,
  //   colors: [{
  //     color_id: '321',
  //     image:{
  //       thumbnail: 'assets/product-pic/thumbnail/08.jpg',
  //       angles: [{
  //         url: '',
  //       }]
  //     }
  //   }]
  // }];
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
  products = [];
  curType = 'All';


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private productService: ProductService, public viewCtrl: ViewController,
              private httpService: HttpService) {
  }

  ngOnInit() {
    this.navBar.setBackButtonText('بازگشت');


    // Get sub-collection
    this.httpService.post('page', {
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
    this.productService.loadProducts(this.collectionId);
    this.productService.productList$.subscribe(
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

  typeChanged(data) {
    this.curType = data._value;
    this.pageName = 'collection/' + this.curType;
    this.productService.loadProducts(this.pageName);
  }

  gotToProductFilter() {
    this.navCtrl.push(FilterPage)
  }
}
