import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from '../../services/http.service';
import {DictionaryService} from '../../services/dictionary.service';
import {imagePathFixer} from '../../shared/lib/imagePathFixer';
import {CollectionsPage} from '../collections/collections';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  searchPhrase = null;
  searchProductList = [];
  searchCollectionList = [];
  searchWaiting = false;
  rows: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private httpService: HttpService, private dictionaryService: DictionaryService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  searchProduct() {
    this.searchProductList = [];
    if (!this.searchPhrase) {
      this.searchProductList = [];
      this.searchCollectionList = [];
      return;
    }
    this.searchWaiting = true;
    this.httpService.post('search/Product', {
      options: {
        phrase: this.searchPhrase,
      },
      offset: 0,
      limit: 11,
    }).subscribe(
      (data) => {
        this.searchProductList = [];
        if (data.data) {
          data.data.forEach(el => {
            this.searchProductList.push({
              id: el._id,
              name: el.name,
              brand: this.dictionaryService.translateWord(el.brand.name),
              type: this.dictionaryService.translateWord(el.product_type.name),
              imgUrl: this.getProductThumbnail(el),
              tags: this.dictionaryService.translateWord(el.tags.name),
              instances: el.instances.article_no,
            });
          });
        }
        this.alignRow();
        this.searchCollection();
      },
      (err) => {
        console.error('Cannot get search data: ', err);
        this.searchWaiting = false;
      });
  }

  searchCollection() {
    this.searchCollectionList = [];
    if (!this.searchPhrase) {
      this.searchCollectionList = [];
      this.searchProductList = [];
      return;
    }
    this.httpService.post('search/Collection', {
      options: {
        phrase: this.searchPhrase,
      },
      offset: 0,
      limit: 5,
    }).subscribe(
      (data) => {
        this.searchCollectionList = [];
        if (data.data) {
          data.data.forEach(el => {
            this.searchCollectionList.push({
              id: el._id,
              name: el.name,
              name_fa: el.name_fa,
            });
          });
        }
        this.searchCollectionList.forEach(el => {
          this.getCollectionPages(el);
        });
        this.searchWaiting = false;
      },
      (err) => {
        console.error('Cannot get search data: ', err);
        this.searchWaiting = false;
      });
  }

  getCollectionPages(el) {
    this.httpService.post('collectionPages', {
      collection_id: el.id,
    }).subscribe(
      (data) => {
        el.pages = data;
      },
      (err) => {
        console.error('Cannot get search data: ', err);
        this.searchWaiting = false;
      });
  }

  getProductThumbnail(product) {
    const img = (product.colors && product.colors.length) ?
      product.colors.filter(el => el.image && el.image.thumbnail) :
      null;
    return img && img.length ?
      imagePathFixer(img[0].image.thumbnail, product._id, img[0]._id) : 'assets/imgs/nike-brand.jpg';
  }

  selectSearchResult(element, isProduct) {
    // this.searchIsFocused = false;
    let address = element.pages[0].address;
    this.searchProductList = [];
    this.searchCollectionList = [];
    if (isProduct) {
      this.navCtrl.push(SearchPage);
    } else if (!isProduct) {
      this.navCtrl.push(CollectionsPage, {address});
    }
  }
  alignRow() {
    if (this.searchProductList.length <= 0) {
      this.rows = [];
      return;
    }
    this.rows = [];
    let chunk = [], counter = 0;
    for (const sp in this.searchProductList) {
      if (this.searchProductList.hasOwnProperty(sp)) {
        chunk.push(this.searchProductList[sp]);
        counter++;

        if (counter >= 2) {
          counter = 0;
          this.rows.push(chunk);
          chunk = [];
        }
      }
    }
    if (counter > 0) {
      this.rows.push(chunk);
    }
  }

  onClear($event) {
    this.searchProductList = [];
    this.searchCollectionList = [];
  }

}
