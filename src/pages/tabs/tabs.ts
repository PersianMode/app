import { Component } from '@angular/core';

import { BagPage } from "../bag/bag";
import { InboxPage } from '../inbox/inbox';
import {ProfilePage} from '../profile/profile';
import {MyShopPage} from '../my-shop/my-shop';
import {FeedPage} from '../feed/feed';
import {CartService} from '../../services/cart.service';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabFeedRoot = FeedPage;
  tabMyShopRoot = MyShopPage;
  tabBagRoot = BagPage;
  tabInboxRoot = InboxPage;
  tabProfileRoot = ProfilePage;
  cartNum = '12';

  constructor( private cartService: CartService) {
  }

  ngOnInit() {
    this.cartNum = this.cartNum.toLocaleString();
    // this.cartService.getCartFromStorage().subscribe(data => {
    //   console.log(data);
    //   this.cartNum = data.length ? '7' : '6';
    // });

  }
}