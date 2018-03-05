import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavParams} from 'ionic-angular';

import {TabsPage} from '../../tabs/tabs';

@Component({
  templateUrl: 'product-filter.html'
})
export class ProductFilterPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navParams: NavParams) {

  }

  ngOnInit() {
    this.navBar.setBackButtonText('بازگشت');

  }




}
