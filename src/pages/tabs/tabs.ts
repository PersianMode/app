import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ProductsPage } from '../products/products';
import { BagPage } from "../bag/bag";
import { InboxPage } from '../inbox/inbox';
import {ProfilePage} from '../profile/profile';

/*TODO s:
  -> padding from right texts in the feed
  -> color is given for the texts in the feed
  -> padding from left in segment bar iOS
  -> fonts
*/

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabHomeRoot = HomePage;
  tabProductsRoot = ProductsPage;
  tabBagRoot = BagPage;
  tabInboxRoot = InboxPage;
  tabProfileRoot = ProfilePage;

  constructor() {

  }
}
