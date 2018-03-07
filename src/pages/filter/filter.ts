import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavParams, Platform} from 'ionic-angular';

import {ProductService} from '../../services/productService';
import {SortOptions} from '../../enum/sort.options.enum';
import {ColorService} from '../../services/colorService';

@Component({
  templateUrl: 'filter.html'
})
export class FilterPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  sortOptions = SortOptions;
  sortOptionList = [];
  selectedSort = null;
  filterOptions = [];
  filterData = [];
  bindingFilters = {};
  screenWidth = 100;
  clearShouldDisabled = true;
  colorMapper = {};

  constructor(public navParams: NavParams, private productService: ProductService,
              private colorService: ColorService) {

  }

  ngOnInit() {
    Object.keys(this.sortOptions).forEach(el => {
      if (el.toLowerCase().charCodeAt(0) >= 97 && el.toLowerCase().charCodeAt(0) <= 122)
        this.sortOptionList.push({name: this.sortOptions[el], value: el});
    });

    this.navBar.setBackButtonText('بازگشت');
    this.initialFilter();
  }

  initialFilter() {
    this.productService.filtering$.subscribe(
      (data) => {
        this.filterOptions = data;
        this.filterOptions.forEach(el => {
          this.bindingFilters[el.name] = {};
          el.values.forEach(value => {
            this.bindingFilters[el.name][value] = false;
          });
        });

        this.colorService.colorIsReady.subscribe(
          (data) => {
            if(data && !this.colorMapper) {
              if(this.bindingFilters['رنگ']) {
                Object.keys(this.bindingFilters['رنگ']).forEach(el => {
                  this.colorMapper[el] = this.colorService.getColorHexCode(el);
                });
              }
            }
          }
        );
      },
      (err) => {
        console.error('Cannot subscribe on filtering$ in productService: ', err);
      }
    );
  }

  sort(option) {
    this.selectedSort = option;
    this.clearShouldDisabled = false;
  }

  updateFilter(name, value) {
    let option = this.filterData.find(el => el.name === name);
    if(option) {
      if(option.values.includes(value))
        option.values = option.values.filter(el => el !== value);
      else
        option.values.push(value);
    } else {
      this.filterData.push({
        name: name,
        values: [value],
      });
    }

    this.checkClearDisability();
  }

  setSize(value) {
    this.bindingFilters['سایز'][value] = !this.bindingFilters['سایز'][value];
    this.checkClearDisability();
  }

  setColor(value) {
    this.bindingFilters['رنگ'][value] = !this.bindingFilters['رنگ'][value];
    this.checkClearDisability();
  }

  filter() {
    Object.keys(this.bindingFilters).forEach(el => {
      Object.keys(this.bindingFilters[el]).forEach(value => {
        if(this.bindingFilters[el][value]){
          let option = this.filterData.find(item => item.name === el);
          if(option){
            if(!option.values.includes(value))
              option.values.push(value);
          } else {
            this.filterData.push({
              name: el,
              values: [value],
            });
          }
        }
      });
    });

    this.productService.setFilter(this.filterData);
    if(this.selectedSort)
      this.productService.setSort(this.selectedSort);
  }

  clearFilterData() {
    Object.keys(this.bindingFilters).forEach(el => {
      Object.keys(this.bindingFilters[el]).forEach(value => {
        this.bindingFilters[el][value] = false;
      });
    });

    this.selectedSort = null;

    this.clearShouldDisabled = true;
  }

  checkClearDisability() {
    this.clearShouldDisabled = true;

    Object.keys(this.bindingFilters).forEach(el => {
      Object.keys(this.bindingFilters[el]).forEach(value => {
        if(this.bindingFilters[el][value]) {
          this.clearShouldDisabled = false;
          return;
        }
      });
    });

    if(this.selectedSort)
      this.clearShouldDisabled = false;
  }
}
