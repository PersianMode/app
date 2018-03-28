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
  selectedSized: any;
  defaultColor: string;

  constructor(public navParams: NavParams) {
    this.selectedSized = this.navParams.get('selected');


    this.selectedSized.forEach((el,index) => {
      this.sizes.forEach(inner_el => {
        console.log(el);
        if (el === inner_el) {
          this.items.push(index)
        }
      });
    });

    //default color set
    this.defaultColor = 'light';


    // chunk sizes 4
    let _chunkArr = [];
    let _sizes = this.sizes;
    const chunkSize = 4;
    let sizeLength = this.sizes.length;

    // loop for chunk chunk array
    for (let i = 0; i < sizeLength; i += chunkSize) {
      _chunkArr.push(_sizes.slice(i, i + chunkSize));
    }
    this.sizes = _chunkArr;
  }

  sizeSelected(rowIndex, colIndex) {
    // find itemIndex
    let itemIndex = rowIndex * 4 + colIndex;
    let _items = this.items;
    // check if not exist then push
    if (!_items.includes(itemIndex)) {
      _items.push(itemIndex);
    } else {
      _items.pop(itemIndex);
    }
  }

  returnSizeSelected() {
    //return size selected
    let _sizeArr = [];
    let _items = this.items;
    let _sizes = this.sizes;
    _items.forEach(el => {
      _sizes.forEach((sizeChunk, index) => {
        let inner_index;
        for (inner_index in Array.from(sizeChunk)) {
          inner_index = parseInt(inner_index);
          if (el === index * 4 + inner_index) {
            _sizeArr.push(_sizes[index][inner_index]);
          }
        }
      });
    });
    console.log(_sizeArr);
  }

}
