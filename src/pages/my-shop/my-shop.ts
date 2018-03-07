import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PageService} from '../../services/page.service';
import {CollectionPage} from '../collection/collection';

export interface Type {
}

export interface Entry {
}

@Component({
  selector: 'page-my-shop',
  templateUrl: 'my-shop.html',
})
export class MyShopPage {

  types = [];
  placement = [];
  typeElements = [];
  subList = [];
  selectTab;


  constructor(private pageService: PageService, public navCtrl: NavController) {

  }

  ionViewWillEnter() {
    this.pageService.getPage('my_shop');

    this.types = [];
    this.pageService.placement$.subscribe(res => {
      this.placement = res;
      this.placement.forEach(item => {
        if (item.component_name === 'menu' && item.variable_name === 'topMenu') {
          this.types.push({
            name: item.info.text,
            href: item.info.href,
            kind: item.info.href.split('/')[item.info.href.split('/').length - 1]
          })
        }
      });

      this.elementType(this.types[0]);
    });
  }

  elementType(type) {
    this.typeElements = [];
    let counter = 0;

    this.placement.filter(el => {
      let section = el.info.section || null;
      if (section)
        section = section.split('/');

      if (el.variable_name === 'subMenu' && (section && section.includes(type.kind)) && el.info.is_header) {
        return el;
      }
    }).forEach(item => {
      this.typeElements.push({
        id: ++counter,
        text: item.info.text,
        imageUrl: item.info.imgUrl,
        kind: item.info.href.split('/')[item.info.href.split('/').length - 1],
        showSubMenu: false,
      });
    });
    this.selectTab = type;

  }

  generateSubMenu(entry) {
    this.subList = [];
    this.placement.filter(el => el.info.section).forEach(item => {
      let section = item.info.section ? item.info.section.split('/') : [];
      if (section.includes(this.selectTab.kind) && item.info.section.includes(entry.kind) && !item.info.is_header)
        this.subList.push({text: item.info.text, href: item.info.href});
    });

    this.toggleSubMenuDisplayment(entry);
  }

  toggleSubMenuDisplayment(subMenu) {
    const tempTypeElement = this.typeElements.find(el => el.id === subMenu.id);
    tempTypeElement.showSubMenu = !tempTypeElement.showSubMenu;
    this.typeElements.find(el => el.id !== subMenu.id).showSubMenu = false;
  }

  goToProductList(address) {
    this.navCtrl.push(CollectionPage, {
      collectionName: address,
      typeName: 'type'
    });
  }
}