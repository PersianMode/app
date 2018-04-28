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

    if (this.product.colors && this.product.colors.length > 0)
      this.thumbnail = this.product.colors[0].image.thumbnail;

  }

  select() {
    this.productIsSelected.emit(this.product.id);
  }
}
