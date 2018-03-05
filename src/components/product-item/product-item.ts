import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'product-item',
  templateUrl: 'product-item.html'
})
export class ProductItemComponent implements OnInit{
  @Output() productIsSelected = new EventEmitter();
  @Input() product;

  constructor() {
  }

  ngOnInit() {
    this.product.desc = this.product.tags ? this.product.tags.join(' ') : null;
  }

  select() {
    this.productIsSelected.emit(this.product.id);
  }
}
