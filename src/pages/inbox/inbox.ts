import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ProductViewPage} from "../products/product-view/product-view";

interface Message {
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  date: Date;
}

@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {
  messages: Message[] = [{
    imageUrl: 'https://cdn1.iconfinder.com/data/icons/hawcons/32/698925-icon-92-inbox-download-512.png',
    title: 'به برنامه پرشین مود خوش آمدید',
    subtitle: 'تمام آنچه که نیاز دارید برای اینکه بهترین باشید',
    description: 'متن توضیحات',
    date: new Date()
  }, {
    imageUrl: 'https://vignette.wikia.nocookie.net/batman/images/f/f0/Bane_TDKR3.jpg',
    title: 'تام هاردی در نقش ونوم!',
    subtitle: 'شایعات بیانگر تمام شدن فیلمبرداری ونوم هستند',
    description: 'توضیحات',
    date: new Date()
  }];

  constructor(public navCtrl: NavController) {

  }

  //this is just a temp entry for product-view
  goToProductView() {
    this.navCtrl.push(ProductViewPage, {
      productId: '5a9fc897bcf5d7654e7a410e'
    });
  }

}
