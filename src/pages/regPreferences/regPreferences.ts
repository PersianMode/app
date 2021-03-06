import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {NavController, ToastController, NavParams} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {HttpClient} from '@angular/common/http';
import {DictionaryService} from '../../services/dictionary.service';
import {TabsPage} from '../tabs/tabs';
import {LoadingService} from '../../services/loadingService';

@Component({
  selector: 'page-reg-preferences',
  templateUrl: './regPreferences.html',
})
export class RegPreferencesPage implements OnInit {
  sizeSelected = [];
  shoesSize = [];
  shoesUS = [];
  items = [];
  shouldSelectedTags = true;
  shouldSelectedSize = false;
  shouldSelectedBrand = false;
  _tags;
  _brands;
  _size;
  preferences = {
    username: null,
    tags: [],
    brands: [],
    size: null
  };
  gender = null;

  isGoogleAuthConfirmation;

  constructor(private httpClient: HttpClient, private httpService: HttpService,
              private toastCtrl: ToastController, private loadingService: LoadingService,
              private navCtrl: NavController, private authService: AuthService,
              private navParams: NavParams, private dict: DictionaryService) {
  }

  ngOnInit() {
    this.preferences.username = this.navParams.get('username') ? this.navParams.get('username') : null;
    this.gender = this.navParams.get('gender') ? this.navParams.get('gender') : 'm';
    this.isGoogleAuthConfirmation = this.navParams.get('isGoogleAuthConfirmation') || null;

    // api tags
    this.httpService.get('tags/Category').subscribe(tagsRes => {
      const tagsArr = [];

      for (let i = 0; i < tagsRes.length; i++) {
        tagsRes[i]['name'] = this.dict.translateWord(tagsRes[i].name.trim())
        tagsArr.push(tagsRes[i])
      }
      this._tags = tagsArr;
    });

    // shoes json
    this.httpClient.get(HttpService.assetPrefix + 'shoesSize.json')
      .subscribe(res => {
        if (this.gender === 'm') {
          res['men'].forEach(element => {
            this.shoesUS.push({value: element['us'], disabled: false, displayValue: element['us']});
          });
        } else {
          res['women'].forEach(element => {
            this.shoesUS.push({value: element['us'], disabled: false, displayValue: element['us']});
          });
        }
        this.shoesSize = this.shoesUS;
      }, err => {
        this.toastCtrl.create({
          message: `shoe size problem! ${JSON.stringify(err)}`,
          duration: 5000
        }).present();
      });

    // api brand
    this.httpService.get('brand').subscribe(brandsRes => {
      const brandsArr = [];
      for (let index = 0; index < brandsRes.length; index++) {
        brandsRes[index]['name'] = this.dict.translateWord(brandsRes[index].name.trim());
        brandsArr.push(brandsRes[index]);
      }
      this._brands = brandsArr;
    });

  }

  itemSelected(value) {
    var index = this.items.indexOf(value);
    if (index > -1) {
      delete value.selected;
      this.items.splice(index, 1);
    } else {
      value['selected'] = true;
      this.items.push(value);
    }
  }

  setTags() {
    this.preferences.tags = this.items;

    // state changes
    this.shouldSelectedTags = false;
    this.shouldSelectedSize = true;
    this.shouldSelectedBrand = false;

  }


  selectSize(size) {
    this.preferences.size = size;
  }

  setSize() {
    // state changes
    this.shouldSelectedTags = false;
    this.shouldSelectedSize = false;
    this.shouldSelectedBrand = true;
    this.items = [];

  }

  setBrand() {
    this.preferences.brands = this.items;
    this.items = [];

    this.loadingService.enable();
    this.httpService.post(`customer/preferences`, {
      username: this.preferences.username,
      preferred_brands: this.preferences.brands,
      preferred_tags: this.preferences.tags,
      preferred_size: this.preferences.size
    }).subscribe(response => {
      this.loadingService.disable();
      this.authService.checkValidation()
        .then(res => {
          if (this.isGoogleAuthConfirmation)
            this.navCtrl.setRoot(TabsPage);
          else
            this.navCtrl.popToRoot();
          // this.authService.applyVerification();
        })
        .catch(err => console.error('error in validation: ', err));
    }, err => {
      this.loadingService.disable();
      console.error('an error occurred: ', err);
    });

  }

  backToTags() {
    this.shouldSelectedTags = true;
    this.shouldSelectedSize = false;
    this.shouldSelectedBrand = false;
  }

  backToSize() {
    this.shouldSelectedTags = false;
    this.shouldSelectedSize = true;
    this.shouldSelectedBrand = false;

    // select size
    this.sizeSelected = [];
    this.sizeSelected.push({value: this.preferences.size, displayValue: this.preferences.size, disabled: true})

  }

}
