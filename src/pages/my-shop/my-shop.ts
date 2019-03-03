import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PageService} from '../../services/page.service';
import {CollectionsPage} from '../collections/collections';
import {HttpService} from '../../services/http.service';
import {SearchPage} from '../search/search';
import {LoadingService} from '../../services/loadingService';


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

  placements$: any;
  currentType: string;


  constructor(private pageService: PageService, public navCtrl: NavController,
              private loadingService: LoadingService) {
  }

  ionViewWillEnter() {
    this.placements$ = this.pageService.placement$.subscribe(res => {
      this.placement = res;
      this.filterAndSet();
    }, err => {
      console.error('Error when subscribing on page placements: ', err);
    });

    this.loadingService.enable({}, 0, () => {
      this.pageService.getPage('music_player').then(() => {
        this.loadingService.disable();
      }).catch(err => {
        this.loadingService.disable();
      });
    });
  }

  filterAndSet() {
    this.types = [];
    this.placement
      .filter(el => el.component_name === 'menu' && el.variable_name === 'topMenu')
      .sort((a, b) => {
        if (a.info.column > b.info.column)
          return 1;
        else if (a.info.column < b.info.column)
          return -1;
        return 0;
      })
      .forEach(item => {
        this.types.push({
          name: item.info.text,
          href: item.info.href,
          kind: item.info.href.split('/')[item.info.href.split('/').length - 1]
        });
      });

    this.elementType(this.types[0]);
  }

  elementType(type) {
    this.typeElements = [];
    let counter = 0;

    this.placement
      .filter(el => {
        let section = el.info.section || null;
        if (section)
          section = section.split('/');

        if (el.variable_name === 'subMenu' && (section && section.includes(type.kind)) && el.info.is_header) {
          return el;
        }
      })
      .sort((a, b) => {
        if (a.info.row > b.info.row)
          return 1;
        else if (a.info.row < b.info.row)
          return -1;
        return 0;
      })
      .forEach(item => {
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

  goToCollection(address) {
    this.navCtrl.push(CollectionsPage, {address});
  }


  ionViewWillLeave() {
    this.placements$.unsubscribe();
  }

  loadImage(imgUrl: string) {
    if (imgUrl) {
      imgUrl = imgUrl[0] === '/' ? imgUrl : '/' + imgUrl;
      return HttpService.addHost(imgUrl);
    }
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }
}
