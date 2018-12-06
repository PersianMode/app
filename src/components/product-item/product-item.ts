import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'product-item',
  templateUrl: 'product-item.html'
})
export class ProductItemComponent implements OnInit {
  @Output() productIsSelected = new EventEmitter();
  @Input() product;
  noImagePic;

  constructor() {
    this.noImagePic = HttpService.assetPrefix + 'imgs/no_image.png';
  }

  ngOnInit() {
    this.product.desc = this.product.tags ? this.product.tags.map(el => el.name).join(' ') : null;
  }

  select() {
    this.productIsSelected.emit(this.product.id);
  }
}
