import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {HttpService} from "../../services/http.service";
import {imagePathFixer} from "../../shared/lib/imagePathFixer";

@Component({
  selector: "product-item",
  templateUrl: "product-item.html"
})
export class ProductItemComponent implements OnInit {
  @Output() productIsSelected = new EventEmitter();
  @Input() product;

  constructor() {
  }

  ngOnInit() {


  }

  select() {
    this.productIsSelected.emit(this.product.id);
  }

  getThumbnailURL() {
    if (this.product.colors && this.product.colors.length > 0) {
      return this.product.colors[0].image.thumbnail;
    }
  }

  getProductDiscount() {
    return this.product.base_price - (this.product.base_price * this.product.discount);
  }
}
