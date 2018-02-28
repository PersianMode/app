import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CollectionPage} from "./collection/collection";
import {HttpClient} from '@angular/common/http';
import {tick} from '@angular/core/testing';
import {noUndefined} from '@angular/compiler/src/util';

export interface Type {
}
export interface Entry {
}
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  subMenu = false;
  types = [];
  placement = [];
  typeElements = [];
  subList = [];
  selectTab: string;
  columnSelected: any;


  constructor(private http: HttpClient, public navCtrl: NavController) {

  }

  ionViewWillEnter() {
    this.types = [];
    this.http.get('assets/shop.json').subscribe(data => {
      this.placement = data['placement'];
      this.placement.forEach(item => {
        if (item.component_name === 'menu' && item.variable_name === 'topMenu') {
          this.types.push({name: item.info.text, href: item.info.href})
        }
      });
      this.elementType(this.types[0]);
    });
  }

  elementType(type) {
    console.log("@@@@@@@",type);
    this.typeElements = [];
    type = type.href.split('/')[1];
    this.placement.filter(el => {
      let section;
      if (el.info.section) {
        section = el.info.section.split('/')[0];
      }
      if (el.variable_name === 'subMenu' && section === type && el.info.is_header && el.info.column === el.info.row) {
        return el;
      }
    }).forEach(item => {
      this.typeElements.push({text: item.info.text, imageUrl: item.imageUrl, column: item.info.column})
    });
    this.selectTab = type;
  }

  showSubMenu(entry) {
    this.columnSelected = entry.column;
    this.subList = [];
    this.placement.filter(el => el.info.section !== undefined).forEach(item => {
      if (item.info.section.split('/')[0] === this.selectTab && !item.info.is_header && item.info.column === this.columnSelected) {
        this.subList.push({text: item.info.text, href: item.info.href});
      }
    });
    this.subMenu = !this.subMenu;
  }

  // goToCollection(type: Type, entry: Entry) {
  //   this.navCtrl.push(CollectionPage, {
  //     type: type,
  //     entry: entry
  //   });
  // }
  //
  // getSeparatedRowBrands(s = 3) {
  //   let total = [];
  //   let chunk = [];
  //   let i;
  //   for (i = 0; i < this.brands.length; i++) {
  //     chunk.push(this.brands[i]);
  //     if (i % s == s - 1 && i != 0) {
  //       total.push(chunk);
  //       chunk = [];
  //     }
  //   }
  //   if (i % s != s - 1)
  //     total.push(chunk);
  //   return total;
  // }

}
