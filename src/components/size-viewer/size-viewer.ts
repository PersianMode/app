import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";

@Component({
  selector: 'app-size-viewer',
  templateUrl: 'size-viewer.html'
})

export class SizeViewerComponent implements OnChanges{

  @Input() sizes = [];
  @Input() selected = [];
  @Input() multi = false;

  @Output()  onSizeSelected = new EventEmitter();
  items: any = [];

  constructor() {



  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.multi)
      this.items = this.selected;

    // chunk sizes 4
    let _chunkArr = [];
    const chunkSize = 4;

    // loop for chunk chunk array
    for (let i = 0; i < this.sizes.length; i += chunkSize) {
      _chunkArr.push(this.sizes.slice(i, i + chunkSize));
    }
    this.sizes = _chunkArr;
  }



  sizeSelected(size) {

    if (this.multi) {

      if (!this.items.includes(size)) {
        this.items.push(size);
      } else {
        this.items = this.items.filter(el => el !== size);
      }
    } else {
      this.items = [];
      this.items.push(size);
    }
    this.onSizeSelected.emit(size);

  }

  itemSelected(size) {
    return this.items.includes(size);
  }



}
