import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import { Type, Entry } from "../products";
import {ProductViewPage} from "../product-view/product-view";

export interface News {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

export interface Product {
  _id: string;
  imageUrl: string;
  name: string;
  tags: string[];
  cost: number;
}

@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {
  currentType: Type;
  currentEntry: Entry;

  news: News[] = [{
      title: 'تخفیف ۲۵٪',
      description: 'تا تاریخ ۱۳۹۶/۱۱/۳۰ از تخفیف‌های ویژه ما بهره‌مند شوید',
      linkText: 'هم‌اکنون خرید کنید',
      linkUrl: ''
    }, {
      title: 'ارسال رایگان',
      description: 'با خرید از اپلیکیشن هزینه‌ی ارسال را حذف کنید',
      linkText: 'دیدن جزپیات',
      linkUrl: ''
    }, {
      title: 'یکسانی',
      description: 'تغییر الهام‌بخش در قدرت ورزش',
      linkText: 'دیدن لینک',
      linkUrl: ''
    }];

  products: Product[] = [{
    _id: '5a967f2dbbcc4a0ac879c7bf',
    imageUrl: '../assets/imgs/shoeSample.png',
    name: 'رانر',
    tags: ['مردانه', 'ورزشی'],
    cost: 120
  }, {
    _id: '5a967f78bbcc4a0ac879c7c2',
    imageUrl: '../assets/imgs/shoeSample.png',
    name: 'رانینگ مستر',
    tags: ['مردانه', 'ورزشی'],
    cost: 150
  }, {
    _id: '5a968e7aa61fc04dcc60d278',
    imageUrl: '../assets/imgs/shoeSample.png',
    name: 'آآآآآ',
    tags: ['ورزشی', 'سوپرخفن'],
    cost: 350
  }];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.currentType = this.navParams.get('type');
    this.currentEntry = this.navParams.get('entry');
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('بازگشت');
  }

  getSeparatedRowProducts(s = 2) {
    let total = [];
    let chunk = [];
    let i;
    for(i = 0; i < this.products.length; i++) {
      chunk.push(this.products[i]);
      if(i % s == s-1 && i != 0) {
        total.push(chunk);
        chunk = [];
      }
    }
    total.push(chunk);
    return total;
  }

  clickedProduct(pid: string = null) {
    this.navCtrl.push(ProductViewPage, {
      productId: pid
    });
  }

}
