import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ProductListPage} from '../product-list/product-list';


export interface Entry {
  name: string;
  imageUrl: string;
}

export interface Type {
  name_en: string;
  name_fa: string;
  entries: Entry[];
}

interface Brand {
  imageUrl: string;
}

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  entries: Entry[] = [{
    name: 'ترند',
    imageUrl: 'https://i.pinimg.com/736x/4d/f6/a3/4df6a38b3aa59db5e1132868ac57c1e7--fashion-me-indie-fashion.jpg',
  }, {
    name: 'کفش',
    imageUrl: 'https://smhttp-ssl-39255.nexcesscdn.net/wp-content/uploads/2013/07/Sanders-Shoes.jpg',
  }, {
    name: 'لباس',
    imageUrl: 'http://images.wisegeek.com/stack-of-colorful-wash-cloths.jpg',
  }, {
    name: 'لوازم جانبی',
    imageUrl: 'https://cdn1.polaris.com/globalassets/pga/apparel/helmets--goggles/2867822.jpg?v=403d6039'
  }];
  secondEntries: Entry[] = [{
    name: 'ترند دوم',
    imageUrl: 'https://i.pinimg.com/736x/4d/f6/a3/4df6a38b3aa59db5e1132868ac57c1e7--fashion-me-indie-fashion.jpg',
  }, {
    name: 'کفش دیگر',
    imageUrl: 'https://smhttp-ssl-39255.nexcesscdn.net/wp-content/uploads/2013/07/Sanders-Shoes.jpg',
  }, {
    name: 'لباس های متنوع',
    imageUrl: 'http://images.wisegeek.com/stack-of-colorful-wash-cloths.jpg',
  }, {
    name: 'لوازم جانبی',
    imageUrl: 'https://cdn1.polaris.com/globalassets/pga/apparel/helmets--goggles/2867822.jpg?v=403d6039'
  }];


  types: Type[] = [
    {
      name_en: 'men',
      name_fa: 'مردانه',
      entries: this.entries
    }, {
      name_en: 'women',
      name_fa: 'زنانه',
      entries: this.secondEntries
    }, {
      name_en: 'boys',
      name_fa: 'پسرانه',
      entries: this.entries
    }, {
      name_en: 'girls',
      name_fa: 'دخترانه',
      entries: this.secondEntries
    }
  ];

  brands: Brand[] = [
    {imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png'},
    {imageUrl: 'http://www.freelogovectors.net/wp-content/uploads/2016/12/hurley-logo.png'},
    {imageUrl: 'https://www.underconsideration.com/brandnew/archives/converse_logo.png'},
    {imageUrl: 'https://s3.amazonaws.com/sneakerfreaker-cdn/image/2017/NIKELAB.jpg?mtime=20171016172748'}
  ];
  currentType: string = this.types[0].name_en;

  constructor(public navCtrl: NavController) {

  }

  goToProductList(colName) {
    this.navCtrl.push(ProductListPage, {
      collectionName: colName,
    });
  }

  getSeparatedRowBrands(s = 3) {
    let total = [];
    let chunk = [];
    let i;
    for(i = 0; i < this.brands.length; i++) {
      chunk.push(this.brands[i]);
      if(i % s == s-1 && i != 0) {
        total.push(chunk);
        chunk = [];
      }
    }
    if(i % s != s-1)
      total.push(chunk);
    return total;
  }

}
