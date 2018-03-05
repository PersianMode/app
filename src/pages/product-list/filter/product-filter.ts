import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavParams} from 'ionic-angular';

import {ProductService} from '../../../services/productService';

@Component({
  templateUrl: 'product-filter.html'
})
export class ProductFilterPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  filterOptions: [] = [];

  constructor(public navParams: NavParams, private productService: ProductService) {

  }

  ngOnInit() {
    this.navBar.setBackButtonText('بازگشت');
    this.initialFilter();
  }

  initialFilter() {
    this.productService.filtering$.subscribe(data => {
      console.log("____data",data);
      this.filterOptions = data
    })
  }


  filteringRun(){

  }


}
