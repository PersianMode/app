import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";

@Component({
  selector: 'app-filter-product-size',
  templateUrl: 'filter-product-size.html'
})

export class FilterProductSize {
  sizes = [
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '3XL',
    '4XL',
    '5XL',
    '6XL',
    '7XL',
    '8XL',
    '9XL',
    '10XL',
  ];
  items: any = [];

  constructor(public navParams: NavParams) {
    this.items = this.navParams.get('selected');

    // chunk sizes 4
    let _chunkArr = [];
    const chunkSize = 4;

    // loop for chunk chunk array
    for (let i = 0; i < this.sizes.length; i += chunkSize) {
      _chunkArr.push(this.sizes.slice(i, i + chunkSize));
    }
    this.sizes = _chunkArr;
  }

  sizeSelected(rowIndex, colIndex) {

    if (!this.items.includes(this.sizes[rowIndex][colIndex])) {
      this.items.push(this.sizes[rowIndex][colIndex]);
    } else {
      this.items = this.items.filter(el => el !== this.sizes[rowIndex][colIndex]);
    }
  }

  itemSelected(size) {
    return this.items.includes(size);
  }

  returnSizeSelected() {
    console.log(this.items);
  }


}
