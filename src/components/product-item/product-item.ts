import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'product-item',
  templateUrl: 'product-item.html'
})
export class ProductItemComponent implements OnInit {
  @Output() productIsSelected = new EventEmitter();
  @Input() product;
  thumbnail: string;

  constructor() {
  }

  ngOnInit() {
    // this.product.desc = this.product.tags ? this.product.tags.join(' ') : null;

    if (this.product.colors && this.product.colors.length > 0)
      if (this.product.colors[0].thumbnail)

        this.thumbnail = this.product.colors[0].thumbnail;
      else
        this.thumbnail = 'assets/imgs/no_image.png'

  }

  select() {
    this.productIsSelected.emit(this.product.id);
  }
}
