import {Component, OnInit} from '@angular/core';
import {BagPage} from '../bag/bag';
import {InboxPage} from '../inbox/inbox';
import {ProfilePage} from '../profile/profile';
import {MyShopPage} from '../my-shop/my-shop';
import {FeedPage} from '../feed/feed';
import {CartService} from '../../services/cart.service';
import {priceFormatter} from '../../shared/lib/priceFormatter';
import {musicPlayerPage} from "../music-player/music-player";

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit {

  tabFeedRoot = FeedPage;
  tabMyShopRoot = MyShopPage;
  tabBagRoot = BagPage;
  tabInboxRoot = InboxPage;
  tabProfileRoot = ProfilePage;
  tabMusicPlayerRoot = musicPlayerPage;
  cartNum;
  itemSubs;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.itemSubs = this.cartService.cartItems.subscribe(res => {
      this.cartNum = res;
    });
  }
  ngOnDestroy() {

  }

  priceFormatter(p) {
    return priceFormatter(p);
  }
}
