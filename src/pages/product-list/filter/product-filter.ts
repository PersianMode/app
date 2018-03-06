import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavParams, Platform} from 'ionic-angular';

import {ProductService} from '../../../services/productService';
import {SortOptions} from '../../../enum/sort.options.enum';
import {HttpService} from '../../../services/http.service';

@Component({
  templateUrl: 'product-filter.html'
})
export class ProductFilterPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  sortOptions = SortOptions;
  sortOptionList = [];
  filterOptions = [
    {
      name: 'برند',
      values: ['آدیداس', 'پلیس', 'نایک', 'گپ'],
    },
    {
      name: 'نوع',
      values: ['کفش', 'لباس', 'عینک', 'کوله ورزشی'],
    },
    {
      name: 'سایز',
      values: ['6', '6.5', '7', '8', '8.5', '9', '10', '10.5', '11', '12', '12.5', '13', '13.5', '5', '14'],
    },
    {
      name: 'رنگ',
      values: ['Black', 'White', 'Yellow', 'Red', 'Brown', 'Blue', 'Green']
    }
  ];
  filterData = {

  };
  screenWidth = 100;
  colorDictionary = null;

  constructor(public navParams: NavParams, private productService: ProductService,
              private httpService: HttpService, private platform: Platform) {

  }

  ngOnInit() {
    this.platform.ready()
      .then(() => {
          this.screenWidth = this.platform.width();
          console.log(this.screenWidth);
        });

    Object.keys(this.sortOptions).forEach(el => {
      if (el.toLowerCase().charCodeAt(0) >= 97 && el.toLowerCase().charCodeAt(0) <= 122)
        this.sortOptionList.push({name: this.sortOptions[el], value: el});
    });

    // Get color dictionary
    this.httpService.get('color/dictionary').subscribe(
      (data) => {
        this.colorDictionary = data;
        console.log('colorDictionary: ', this.colorDictionary);
      },
      (err) => {
        console.error('Cannot get color dictionary');
      }
    );

    this.navBar.setBackButtonText('بازگشت');
    this.initialFilter();
  }

  initialFilter() {
    this.productService.filtering$.subscribe(data => {
      console.log("initialFilter", data);
    })
  }

  sort(optionCode) {
    console.log(optionCode);
  }

  updateFilter(value) {
    console.log(value);
  }
}
