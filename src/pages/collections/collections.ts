import {Component, ViewChild} from '@angular/core';
import {Navbar, NavController, NavParams} from 'ionic-angular';
import {FilterPage} from '../filter/filter';
import {PageService} from '../../services/page.service';


@Component({
  selector: 'page-collection',
  templateUrl: 'collections.html',
})
export class CollectionsPage {
  @ViewChild(Navbar) navBar: Navbar;
  productsCount = 0;
  pageName = null;
  target;
  menuItems: IMenu[];
  activeMenu: string;
  placements$: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private pageService: PageService) {
  }


  ionViewWillEnter() {

    this.navBar.setBackButtonText('بازگشت');
    let address = this.navParams.get('address');

    if (address) {
      this.placements$ = this.pageService.placement$.subscribe(res => {

        console.log('-> ', res);

        this.menuItems = res.map(x => {
          if (x.component_name === 'menu')
            return x.info;
        });

        this.activeMenu = this.menuItems[0].href;



      }, err => {
        console.error('Error when subscribing on page placements: ', err);
      });
      this.pageService.getPage(address);


    }
  }

  toProductDetails(id) {
    console.log(id);
  }

  gotToProductFilter() {
    this.navCtrl.push(FilterPage)
  }

  menuItemChanged(item: IMenu) {

    this.target = item.href;

  }

  ionViewWillLeave() {

    this.placements$.unsubscribe();

  }

}
