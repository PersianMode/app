import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {SortOptions} from '../enum/sort.options.enum';
import {ReplaySubject} from 'rxjs/ReplaySubject';

/*
 * This service is responsible for fetching products and filtering theme. Then serve to specific service
 */

@Injectable()
export class ProductService {
  originProducts = [];
  products = [];
  productList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filtering$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  private filteringOptions = new Subject<any>();
  filteringOptions$ = this.filteringOptions.asObservable();
  shouldFiltered = true;
  sortOptions = SortOptions;
  filterData = {};
  sortData = null;

  constructor(private httpService: HttpService) {
    this.filterSortProducts();
  }

  extractFilters() {

    const types = Array.from(new Set(this.products.map(x => x['product_type'].name)));

    let colors = [];
    let _colors: any = this.products.map(x => x['colors']);
    _colors = [].concat.apply([], _colors).map(x => x.name);
    _colors.forEach(c => c.split('/').map(x => x.trim()).forEach(x => colors.push(x)));
    colors = Array.from(new Set(colors));

    let sizes = this.products.map(x => x['size']);
    sizes = Array.from(new Set([].concat.apply([], sizes)));

    const prices = Array.from(new Set((this.products.map(x => x['base_price']))));

    const filter = [];

    if (types.length > 1) filter.push({name: 'نوع', values: types});
    if (colors.length > 1) filter.push({name: 'رنگ', values: colors});
    if (sizes.length > 1) filter.push({name: 'سایز', values: sizes});
    if (prices.length > 1) filter.push({name: 'قیمت', values: prices});

    this.filtering$.next(filter);
  }


  loadProducts(collection_id) {
    //Get products from server
    this.httpService.get('collection/' + collection_id).subscribe(
      (data) => {
        console.log('____',data);
        this.originProducts = data;
        this.products = data;

        if (this.shouldFiltered)
          this.extractFilters();

        this.filterSortProducts();
      },
      (err) => {
        console.error('Cannot get products of collection: ', err);
      }
    );
  }

  getProducts(startIndex, boundSize = 10) {
    const tempProducts = this.filterSortProducts(true);
    if (tempProducts && tempProducts.length > 0 && tempProducts.length > startIndex)
      this.productList.next(tempProducts.slice(0, startIndex + boundSize));
  }

  filterSortProducts(returnData = false) {
    const newData = this.sortProducts(this.sortData, this.filterProducts(this.filterData));

    if (returnData)
      return newData;
    this.productList.next(newData);
  }

  private filterProducts(options) {
    // Mock code
    //Set filters
    return this.products;
  }

  private sortProducts(option, data) {
    switch (option) {
      case this.sortOptions.newest: {
        return data.sort(this.newestSort);
      }
        ;
      case this.sortOptions.lowerPrice: {
        return data.sort((a, b) => this.priceSort(a, b, true));
      }
        ;
      case this.sortOptions.highestPrice: {
        return data.sort((a, b) => this.priceSort(a, b, false));
      }
        ;
      default: {
        return this.products;
      }
        ;
    }
  }

  private newestSort(a, b) {
    if (a.date > b.date)
      return 1;
    else if (a.date < b.date)
      return -1;
    else
      return this.nameSort(a, b);
  }

  private priceSort(a, b, lowToHigh = true) {
    const dir = lowToHigh ? 1 : -1;
    if (a.base_price < b.base_price)
      return dir * 1;
    else if (a.base_price > b.base_price)
      return dir * -1;
    else
      return this.nameSort(a, b);
  }

  private nameSort(a, b) {
    if (a.name > b.name)
      return 1;
    else if (a.name < b.name)
      return -1;
    else
      return 0;
  }
}
