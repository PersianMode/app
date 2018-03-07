import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Navbar, NavController, NavParams, ViewController} from 'ionic-angular';
import {ProductService} from '../../../services/productService';
import {FilterPage} from '../../filter/filter';

@Component({
  selector: 'page-collection-viewer',
  templateUrl: 'collection-viewer.html',
})
export class CollectionViewerComponent implements OnInit, OnChanges {

  @Input() address;
  products = [];
  collectionName;
  totalProducts = [];
  countPerScroll = 20;
  cScrollIndex = 0;
  scrollCounter = 0;


  constructor(public navCtrl: NavController, private productService: ProductService) {
  }

  ngOnInit() {
    this.productService.productList$.subscribe(
      (data) => {
        this.totalProducts = data;
        this.products = this.totalProducts.slice(0, this.countPerScroll)
      },
      (err) => {
        console.error('Error when subscribing on productList: ', err);
      }
    );
    this.productService.collectionInfo$.subscribe(res => {
      this.collectionName = res;
    }, err => {
      console.error('Error when subscribing on collection info: ', err);

    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.address && changes.address.currentValue) {
      this.address = changes.address.currentValue;
      this.productService.loadProducts(this.address);
    }

  }


  loadOtherProducts(infiniteScroll) {
    this.scrollCounter++;

    this.cScrollIndex = this.countPerScroll * this.scrollCounter;

    if (this.products.length !== this.totalProducts.length) {
      this.products =  this.products.concat(this.totalProducts.slice(this.cScrollIndex - 1, this.cScrollIndex - 1 + this.countPerScroll));
      infiniteScroll.complete();
    }
  }

  toProductDetails(id) {
    console.log(id);
  }

  gotToProductFilter() {
    this.navCtrl.push(FilterPage)
  }
}
