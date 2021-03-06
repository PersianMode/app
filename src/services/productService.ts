import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IFilter} from '../interfaces/ifilter.interface';
import {ToastController} from 'ionic-angular';
import {DictionaryService} from './dictionary.service';
import {imagePathFixer} from '../shared/lib/imagePathFixer';
import {LoadingService} from './loadingService';

const productColorMap = function (r) {
  return r.colors.map(c => c.name ? c.name.split("/")
      .map(x => x.replace(/\W/g, '')) // remove all non alpha-numeric chars from color value
    : []);
};

const newestSort = function (a, b) {
  if (a.year && b.year && a.season && b.season && ((a.year * 8 + a.season) - (b.year * 8 + b.season))) {
    return (a.year * 8 + a.season) - (b.year * 8 + b.season);
  } else if (a.date > b.date) {
    return 1;
  }
  else if (a.date < b.date)
    return -1;
  else {
    return 0;
  }
};

const reviewSort = function (a, b) {
  return 0;
};

const priceSort = function (a, b, lowToHigh = true) {
  const dir = lowToHigh ? 1 : -1;
  return (a.price - b.price) * dir;
};

const priceSortReverse = (a, b) => priceSort(a, b, false);

const nameSort = function (a, b) {
  if (a.name > b.name) {
    return 1;
  }
  else if (a.name < b.name) {
    return -1;
  }
  else {
    return 0;
  }
};

@Injectable()
export class ProductService {
  private collectionName: string;
  private products = [];
  private filteredProducts = [];
  collectionNameFa$: ReplaySubject<any> = new ReplaySubject<any>(0);
  productList$: ReplaySubject<any[]> = new ReplaySubject<any[]>(0);
  filtering$: ReplaySubject<IFilter[]> = new ReplaySubject<IFilter[]>(0);
  product$: ReplaySubject<any> = new ReplaySubject<any>(0);
  collectionTags: any = {};
  collectionTagsAfterFilter: any = {};

  private sortInput;

  private _savedChecked: any = {};
  private _savedSort: any = {};


  constructor(private httpService: HttpService, private toastCtrl: ToastController,
              private dict: DictionaryService, private loadingService: LoadingService) {
  }

  getSavedChecked(): any {
    return this._savedChecked;
  }

  saveChecked(value: any) {
    this._savedChecked = value;
  }

  getSavedSort(): any {
    return this._savedSort;
  }

  saveSort(value: any) {
    this._savedSort = value;
  }

  extractFilters(filters = [], trigger = "") {
    this.loadingService.enable({}, 500, () => {
      const products = trigger ? this.filteredProducts : this.products;
      let tags: any = {};

      const brand = Array.from(new Set([...products.map(r => r.brand)]));
      const type = Array.from(new Set([...products.map(r => r.product_type)]));

      const size = Array.from(new Set([...products.map(r => Object.keys(r.sizesInventory))
        .reduce((x, y) => x.concat(y), []).sort()]));
      const color = Array.from(new Set([...products.map(productColorMap)
        .reduce((x, y) => x.concat(y), []).reduce((x, y) => x.concat(y), [])]));

      let price;
      if (trigger === "price") {
        price = [];
      } else {
        price = products.map(r => r.base_price);

        if (price && price.length > 1 && price[0] !== price[1]) {
          const minPrice = Math.min(...price);
          const maxPrice = Math.max(...price);
          price = [minPrice, maxPrice];
        } else {
          price = [];
        }
      }

      tags = {brand, type, price, size, color};

      if (trigger && trigger !== "price") {
        tags[trigger] = this.collectionTags[trigger] ? this.collectionTags[trigger] : [];
      }

      products.forEach(p => p.tags.forEach(tag => {
        const tagGroupName = tag.tg_name;
        if (!tags[tagGroupName]) {
          tags[tagGroupName] = new Set();
        }
        tags[tagGroupName].add(tag.name);
      }));

      if (trigger) {
        this.collectionTagsAfterFilter = tags;
      } else {
        this.collectionTags = tags;
      }

      const emittedValue = [];
      for (const name in tags) {
        if (tags.hasOwnProperty(name)) {
          const values = Array.from(tags[name]);
          const found = filters.find(r => r.name === name);
          if (values.length > 1 || (found && found.values.length)) {
            emittedValue.push({
              name: name,
              name_fa: this.dict.translateWord(name),
              values,
              values_fa: values.map((r: string | number) => name !== "color" ? this.dict.translateWord(r) : this.dict.convertColor(r + ""))
            });
          }
        }
      }
      this.filtering$.next(emittedValue);
      this.loadingService.disable();
    });
  }

  applyFilters(filters, trigger) {
    this.loadingService.enable({}, 500, () => {
      this.filteredProducts = JSON.parse(JSON.stringify(this.products));
      filters.forEach(f => {
        if (f.values.length) {
          if (["brand", "type"].includes(f.name)) {
            this.filteredProducts = this.filteredProducts.filter(r => Array.from(f.values).includes(r[f.name]));
          } else if (f.name === "color") {
            this.filteredProducts
              .forEach((p, pi) => this.filteredProducts[pi].colors = p.colors
                .filter(c => Array.from(f.values).filter(v => c.name ? c.name.split("/").includes(v) : false).length));
            this.filteredProducts.forEach((p, pi) => this.enrichProductData(this.filteredProducts[pi]));
          } else if (f.name === "size") {
            this.filteredProducts.forEach((p, pi) => this.filteredProducts[pi].instances = p.instances
              .filter(i => Array.from(f.values).includes(i.size)));
            this.filteredProducts.forEach((p, pi) => this.filteredProducts[pi].colors = p.colors
              .filter(c => p.instances.map(i => i.product_color_id).includes(c._id)));
            this.filteredProducts.forEach((p, pi) => this.enrichProductData(this.filteredProducts[pi]));
          } else if (f.name === "price") {
            this.filteredProducts = this.filteredProducts.filter(p => p.base_price >= f.values[0] && p.base_price <= f.values[1]);
          } else {
            this.filteredProducts = this.filteredProducts
              .filter(p => p.tags.filter(t => Array.from(f.values).includes(t.name)).length);
          }
        }

        this.filteredProducts = this.cleanProductsList(this.filteredProducts);
      });
      this.sortProductsAndEmit();
      this.extractFilters(filters, trigger);
      this.loadingService.disable();
    });
  }

  getProduct(productId) {
    return new Promise((resolve, reject) => {
      const found = this.products.findIndex(r => r._id === productId);
      if (found >= 0 && this.products[found].detailed) {
        this.product$.next(this.products[found]);
      } else {
        this.loadingService.enable();
        this.httpService.get(`product/${productId}`).subscribe(data => {
          this.enrichProductData(data);
          if (found >= 0) {
            this.products[found] = data;
          }
          this.product$.next(data);
          this.loadingService.disable();
          resolve(data);
        }, err => {
          console.error("could not get product details: ", err);
          this.loadingService.disable();
          reject(err);
        });
      }
    });
  }

  getProducts(productIds) {
    const promiseList = [];
    productIds.forEach(i => {
      const found = this.products.findIndex(r => r._id === i);
      if (found >= 0 && this.products[found].detailed) {
        promiseList.push(Promise.resolve(this.products[found]));
      } else {
        promiseList.push(this.httpService.get(`product/${i}`).toPromise());
      }
    });

    return Promise.all(promiseList);
  }

  private cleanProductsList(data: any[]) {
    return data.filter(p => p.instances.length && p.colors.length);
  }

  private enrichProductData(data) {
    data.id = data._id;
    data.type = data.product_type;
    data.price = data.base_price;
    const year = data.tags.find(r => r.tg_name === "Season Year");
    const season = data.tags.find(r => r.tg_name === "Season");
    data.year = year ? +year.name : NaN;
    data.season = season ? ["HOLI", "CORE", "WINTER", "SPRING", "SUMMER", "FALL"].indexOf(season.name) : NaN;
    data.sizesByColor = {};
    data.sizesInventory = {};
    data.colors.forEach(item => {
      const angles = [];
      item.image.angles.forEach(r => {
        if (!r.url) {
          const temp = {
            url: imagePathFixer(r, data.id, item._id),
            type: r.split(".").pop(-1) === "webm" ? "video" : "photo"
          };
          angles.push(temp);
        } else {
          angles.push(r);
        }
      });
      item.image.angles = angles;
      if (item.image.thumbnail) {
        item.image.thumbnail = imagePathFixer(item.image.thumbnail, data.id, item._id);
      }
      if (data.instances) {
        item.soldOut = data.instances
          .filter(r => r.product_color_id === item._id)
          .map(r => r.inventory)
          .map(r => r.map(e => e.count ? e.count : 0).reduce((x, y) => x + y, 0))
          .reduce((x, y) => x + y, 0) <= 0;

        data.sizesByColor[item._id] = data.instances
          .filter(r => r.product_color_id === item._id)
          .map(r => {
            const inventory = r.inventory.map(e => e.count ? e.count : 0).reduce((x, y) => x + y, 0);
            if (inventory) {
              if (!data.sizesInventory[r.size]) {
                data.sizesInventory[r.size] = {};
              }
              data.sizesInventory[r.size][item._id] = inventory;
            }
            return {
              value: r.size,
              disabled: inventory <= 0,
            };
          });
      }
      data.detailed = data.hasOwnProperty("reviews") || data.hasOwnProperty("details") || data.hasOwnProperty("desc");
    });
  }

  loadProducts(address) {
    this.loadingService.enable();
    this.httpService.post("collection/app/products", {address}).subscribe(
      (data) => {
        if (data.name_fa) {
          this.collectionName = data.name_fa;
          this.collectionNameFa$.next(data.name_fa);

        }
        if (data.products) {
          for (const product of data.products) {
            this.enrichProductData(product);
          }
          this.products = data.products;
          this.filteredProducts = this.products.slice();

          this._savedSort = {value: null};
          this._savedChecked = {};
          this.extractFilters();
          this.productList$.next(this.filteredProducts);
          this.loadingService.disable();
        }
      },
      (err) => {
        console.error("Cannot get products of collection: ", err);
        this.toastCtrl.create({
          message: err.status === 404 ? "لیست محصولی وجود ندارد" : "خطا در دریافت لیست محصولات",
          duration: 3200,
        }).present();
        this.productList$.next([]);
        this.loadingService.disable();
      }
    );
  }

  setSort(sortInput) {
    if (this.sortInput !== sortInput) {
      this.sortInput = sortInput;
      this.sortProductsAndEmit();
    }
  }

  private sortProductsAndEmit() {
    this.loadingService.enable({}, 500, () => {
      let sortedProducts = [];
      switch (this.sortInput) {
        case "newest": {
          sortedProducts = this.filteredProducts.slice().sort(newestSort);
          break;
        }
        case "highest": {
          sortedProducts = this.filteredProducts.slice().sort(reviewSort);
          break;
        }
        case "cheapest": {
          sortedProducts = this.filteredProducts.slice().sort(priceSort);
          break;
        }
        case "most": {
          sortedProducts = this.filteredProducts.slice().sort(priceSortReverse);
          break;
        }
        case "alphabetical": {
          sortedProducts = this.filteredProducts.slice().sort(nameSort);
          break;
        }
        default: {
          sortedProducts = this.filteredProducts;
        }
      }
      this.productList$.next(sortedProducts);
      this.loadingService.disable();
    });
  }

  updateProducts(updatedProducts) {
    updatedProducts.forEach(product => {
      const found = this.products.findIndex(r => r._id === product._id);
      this.enrichProductData(product);
      if (found >= 0) {
        this.products[found] = product;
      }
    });
  }
}
