import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavParams, ViewController} from 'ionic-angular';

import {ProductService} from '../../services/productService';
import {DictionaryService} from '../../services/dictionary.service';
import {priceFormatter} from '../../shared/lib/priceFormatter';
import {ISize} from '../../interfaces/isize.interface';

@Component({
  templateUrl: 'filter.html'
})
export class FilterPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  sortOptions = [
    {
      value: 'newest',
      fa: 'تازه‌ترین‌ها',
    },
    {
      value: 'highest',
      fa: 'بالاترین امتیازها',
    },
    {
      value: 'cheapest',
      fa: 'ارزان‌ترین‌ها',
    },
    {
      value: 'most',
      fa: 'گران‌ترین‌ها',
    }
  ];
  filter_options: any;
  current_filter_state = [];
  sortedBy: any = {value: null};
  isChecked: any = {};
  oppositeColor: any = {};
  needsBorder: any = {};
  minPrice;
  maxPrice;
  selectedMinPriceFormatted = '';
  selectedMaxPriceFormatted = '';

  filter_options$: any;

  rangeValues: any = {lower: 0, upper: 0};

  sizes: ISize[];
  checkedSizes: ISize[];


  constructor(public navParams: NavParams, public viewCtrl: ViewController,
              private productService: ProductService, private dict: DictionaryService) {

  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('بازگشت');
    // this.productService.extractFilters();
  }

  ngOnInit() {
    this.filter_options$ = this.productService.filtering$.subscribe(r => {
      this.filter_options = r;

      this.isChecked = this.productService.getSavedChecked();
      this.sortedBy = this.productService.getSavedSort();

      this.filter_options.forEach(el => {
        const found = this.current_filter_state.find(cfs => cfs.name === el.name);
        if (!found) {
          this.current_filter_state.push({name: el.name, values: []});
        }
        if (!this.isChecked[el.name]) {
          this.isChecked[el.name] = {};
          for (const key of el.values) {
            this.isChecked[el.name][key] = false;
          }
        }
      });


      const foundSizes = r.find(fo => fo.name === 'size');
      this.sizes = foundSizes ? foundSizes.values.map(x => {
        return {value: x, disabled: false}
      }) : [];
      // this.checkedSizes = Object.keys(this.isChecked['size']).filter(x => this.isChecked['size'].x);
      this.checkedSizes = [];
      for (let key in this.isChecked['size']) {
        if (this.isChecked['size'].hasOwnProperty(key)) {
          if (this.isChecked['size'][key])
            this.checkedSizes.push({value: key, disabled: false})
        }
      }

      const prices = r.find(fo => fo.name === 'price');
      if (prices && prices.values.length) {
        if (!this.minPrice)
          this.minPrice = prices.values[0];
        if (!this.maxPrice)
          this.maxPrice = prices.values[1];

        this.rangeValues['lower'] = prices.values[0];
        this.rangeValues['upper'] = prices.values[1];
        this.formatPrices();
      }

      for (const col in this.isChecked.color) {
        let color;
        color = this.dict.convertColor(col);
        if (color) {
          this.oppositeColor[col] = parseInt(color.substring(1), 16) < parseInt('888888', 16) ? 'white' : 'black';
          const red = color.substring(1, 3);
          const green = color.substring(3, 5);
          const blue = color.substring(5, 7);
          const colors = [red, green, blue];
          this.needsBorder[col] = colors.map(c => parseInt('ff', 16) - parseInt(c, 16) < 16).reduce((x, y) => x && y);
        } else {
          this.oppositeColor[col] = 'white';
        }
      }
    });
  }

  formatPrices() {
    [this.selectedMinPriceFormatted, this.selectedMaxPriceFormatted] = Object.values(this.rangeValues).map(priceFormatter);
  }

  getValue(name, value) {
    this.isChecked[name][value] = !this.isChecked[name][value];

    this.current_filter_state.forEach(el => {
      if (el.name === name) {
        if (this.isChecked[name][value] && (el.values.length === 0 || el.values.findIndex(i => i === value) === -1 ))
          el.values.push(value);
        else {
          const ind = el.values.indexOf(value);
          if (ind > -1)
            el.values.splice(ind, 1);
        }
      }
    });
    this.productService.saveChecked(this.isChecked);
    this.productService.applyFilters(this.current_filter_state, name);
  }

  priceRangeChange() {
    Object.values(this.rangeValues).map((r: any) => Math.round(r / 1000) * 1000);
    this.current_filter_state.find(r => r.name === 'price').values = Object.values(this.rangeValues);
    this.formatPrices();
    this.productService.saveChecked(this.isChecked);
    this.productService.applyFilters(this.current_filter_state, 'price');

  }

  clearFilters() {
    this.current_filter_state.forEach(el => {
      el.values = [];
    });

    for (const name in this.isChecked) {
      for (const value in this.isChecked[name]) {
        this.isChecked[name][value] = false;
      }
    }

    this.sortedBy = null;
    this.productService.saveChecked(this.isChecked);
    this.productService.applyFilters(this.current_filter_state, '');
  }

  selectSortOption(index) {
    if (this.sortedBy && this.sortedBy.value === this.sortOptions[index].value) {
      this.sortedBy = {value: null};
    } else {
      this.sortedBy = this.sortOptions[index];
    }
    this.productService.saveSort(this.sortedBy);
    this.productService.setSort(this.sortedBy.value);

  }

  ionViewWillLeave() {
    this.filter_options$.unsubscribe();
  }


}
