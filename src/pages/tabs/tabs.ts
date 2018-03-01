import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ProductsPage } from '../products/products';
import { BagPage } from "../bag/bag";
import { InboxPage } from '../inbox/inbox';
import {ProfilePage} from '../profile/profile';

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
