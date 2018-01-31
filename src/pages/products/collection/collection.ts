import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import { Type, Entry } from "../products";

export interface News {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

export interface Product {
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
    imageUrl: '../assets/imgs/shoeSample.png',
    name: 'علی',
    tags: ['مردانه', 'ورزشی'],
    cost: 120
  }, {
    imageUrl: '../assets/imgs/shoeSample.png',
    name: 'محسن',
    tags: ['مردانه', 'ورزشی'],
    cost: 150
  }, {
    imageUrl: '../assets/imgs/shoeSample.png',
    name: 'ورزشی سوپرخفن',
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

}
