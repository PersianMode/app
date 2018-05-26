import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from '../../services/http.service';
import {DictionaryService} from '../../services/dictionary.service';
import {imagePathFixer} from '../../shared/lib/imagePathFixer';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  searchPhrase = null;
  searchProductList = [];
  searchCollectionList = [];
  searchWaiting = false;
  i = 0;

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
      return;
    }

    this.searchWaiting = true;
    this.httpService.post('search/Product', {
      options: {
        phrase: this.searchPhrase,
      },
      offset: 0,
      limit: 5,
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

  selectSearchResult(el, isProduct) {

  }

  onCancel($event) {
    this.i++;
    console.log('I : ', this.i);
  }

}
