import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {NavController, ToastController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {AuthService} from "../../services/auth.service";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-reg-preferences',
  templateUrl: './regPreferences.html',
})
export class RegPreferencesPage implements OnInit {
  shoesSize = [];
  shoesUS = [];
  items = [];
  shouldSelectedTags = true;
  shouldSelectedSize = false;
  shouldSelectedBrand = false;
  _tags;
  _brands;
  _size;
  chunkTag: any = [];
  preferences = {
    username: null,
    tags: [],
    brands: [],
    size: null
  }
  gender = null;

  constructor(private httpClient: HttpClient,private httpService: HttpService, private toastCtrl: ToastController,
    private navCtrl: NavController, private authService: AuthService,
    private navParams: NavParams) {
  }

  ngOnInit() {
    this.preferences.username = this.navParams.get('username') ? this.navParams.get('username') : null;
    this.gender = this.navParams.get('gender') ? this.navParams.get('gender') : 'm';
    console.log(this.gender, this.preferences.username);
    
    // api tags
    this.httpService.get('tags/Category').subscribe(tagsRes => {
      this.chunkTag = [];
      const chunkLength = 3;
  
      // loop for chunk chunk array
      for (let i = 0; i < tagsRes.length; i += chunkLength) {
        this.chunkTag.push(tagsRes.slice(i, i + chunkLength));
      }
      this._tags = this.chunkTag;

    });
    // shoes json
    this.httpClient.get('../../assets/shoesSize.json').subscribe(res => {
      if (this.gender === 'm') {
        res['men'].forEach(element => {
          this.shoesUS.push({value: element['us'], disabled: false, displayValue:  element['us']});
        });
      } else {
        res['women'].forEach(element => {
          this.shoesUS.push({value: element['us'], disabled: false, displayValue:  element['us']});
        });
      }
      this.shoesSize = this.shoesUS;
    });
    // api brand
    this.httpService.get('brand').subscribe(brandsRes => {
      this._brands = brandsRes;
    });

  }
  itemSelected(value){
    var index = this.items.indexOf(value);
    if (index > -1) {
      delete value.selected;
      this.items.splice(index, 1);
    }else {
      value['selected'] = true;
      this.items.push(value);
    }
  }

  setTags() {
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
    // empty select items
    this.preferences.tags = this.items
    this.items = [];
  }

  setBrand() {
    this.preferences.brands = this.items
    this.items = [];
    this.navCtrl.setRoot(TabsPage);
    this.httpService.post(`customer/preferences`, {
      username: this.preferences.username,
      preferred_brands: this.preferences.brands,
      preferred_tags: this.preferences.tags,
      preferred_size: this.preferences.size
    }).subscribe(response => {
      console.log('Done!!!');
      this.authService.applyVerification();
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
  }

}
