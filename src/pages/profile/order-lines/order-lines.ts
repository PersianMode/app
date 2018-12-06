import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {OrderService} from '../../../services/order.service';
import {DictionaryService} from '../../../services/dictionary.service';
import {imagePathFixer} from '../../../shared/lib/imagePathFixer';
import {OrderStatus} from '../../../enum/order_status';
import {makePersianNumber} from '../../../shared/lib/makePersianNumber';

@Component({
  selector: 'page-order-lines',
  templateUrl: 'order-lines.html',
})
export class OrderLinesPage implements OnInit {
  orderData: any;
  orderLines = [];
  noDuplicateOrderLine = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private orderService: OrderService,
              private dict: DictionaryService) {
  }

  ngOnInit() {
    this.orderData = this.orderService.orderData;
    this.orderLines = this.orderData.dialog_order.order_lines;
    this.removeDuplicates(this.orderLines);
    this.findBoughtColor(this.noDuplicateOrderLine);
  }

  removeDuplicates(arr) {
    const instancArr = [];
    arr.forEach(el => {
      this.orderData.dialog_order.order_lines
        .forEach(elx => {
          if (elx.order_line_id === el.order_line_id)
            el['order_id'] = this.orderData.dialog_order._id;
        });
      const gender = el.product.tags.find(tag => tag.tg_name.toUpperCase() === 'GENDER').name;
      instancArr.push(el.product_instance._id);
      el.quantity = 1;
      el.product_instance.displaySize = this.dict.setShoesSize(el.product_instance.size, gender, el.product.product_type.name);
      this.noDuplicateOrderLine.push(el);
    });
  }

  findBoughtColor(arr) {
    arr.forEach(el => {
      const boughtColor = el.product.colors.find(c => c._id === el.product_instance.product_color_id);
      el.boughtColor = boughtColor;
    });
  }

  getThumbnailURL(boughtColor, product): string {
    return imagePathFixer(boughtColor.image.thumbnail, product._id, boughtColor._id);
  }

  makePersianNumber(a: string, isPrice) {
    return makePersianNumber(a, isPrice);
  }

  orderStatus(ol) {
    return ol.tickets.length !== 0 ? OrderStatus.filter(os => os.status === ol.tickets[ol.tickets.length - 1].status)[0].title : 'نامشخص';
  }
}
