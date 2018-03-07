import { Component } from '@angular/core';

import { BagPage } from "../bag/bag";
import { InboxPage } from '../inbox/inbox';
import {ProfilePage} from '../profile/profile';
import {MyShopPage} from '../my-shop/my-shop';
import {FeedPage} from '../feed/feed';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabFeedRoot = FeedPage;
  tabMyShopRoot = MyShopPage;
  tabBagRoot = BagPage;
  tabInboxRoot = InboxPage;
  tabProfileRoot = ProfilePage;

  constructor() {

  }
}
