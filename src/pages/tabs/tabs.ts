import { Component } from '@angular/core';

import { FeedPage } from '../feed/feed';
import { ProductsPage } from '../products/products';
import { BagPage } from "../bag/bag";
import { InboxPage } from '../inbox/inbox';
import {ProfilePage} from '../profile/profile';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabHomeRoot = FeedPage;
  tabProductsRoot = ProductsPage;
  tabBagRoot = BagPage;
  tabInboxRoot = InboxPage;
  tabProfileRoot = ProfilePage;

  constructor() {

  }
}
