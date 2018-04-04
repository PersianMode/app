import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {ISize} from '../../interfaces/isize.interface';

@Component({
  selector: 'app-size-viewer',
  templateUrl: 'size-viewer.html'
})

export class SizeViewerComponent implements OnChanges {

  @Input() sizes: ISize[] = [];
  @Input() selected = [];
  @Input() multi = false;

  @Output() onSizeSelected = new EventEmitter();
  items: any = [];

  chunkSizes: any = [];

  constructor() {


  }


  ngOnChanges(changes: SimpleChanges): void {

    this.items = this.selected;

    this.chunkSizes = [];
    // chunk sizes 4
    const chunkLength = 4;

    // loop for chunk chunk array
    for (let i = 0; i < this.sizes.length; i += chunkLength) {
      this.chunkSizes.push(this.sizes.slice(i, i + chunkLength));
    }
    this.sizes = this.chunkSizes;
  }


  sizeSelected(size) {

    if (this.multi) {

      let index = this.items.findIndex(x => x.value === size.value);
      if (index === -1) {
        this.items.push(size);
      } else {
        this.items.splice(index, 1);
      }
    } else {
      this.items = [];
      this.items.push(size);
    }
    this.onSizeSelected.emit(size.value);

  }

  itemSelected(size) {
    return this.items.findIndex(x => x.value === size.value) !== -1;
  }


}