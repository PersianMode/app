import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { Type, Entry } from "../products";

export interface News {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {
  currentType: Type;
  currentEntry: Entry;

  news: News[] = [
    {
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
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currentType = this.navParams.get('type');
    this.currentEntry = this.navParams.get('entry');
  }

}
