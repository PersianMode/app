import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {CartService} from "../../services/cart.service";
import {priceFormatter} from "../../shared/lib/priceFormatter";
import {CheckoutPage} from "../checkout/checkout";
import {ProductService} from '../../services/productService';

@Component({
  selector: 'page-bag',
  templateUrl: 'bag.html',
})
export class BagPage implements OnInit {
  products: any[] = [];
  cartItemsLength: number = 0;
  isPromoCodeShown: Boolean = false;
  loyalty_point: number = 0;
  balance: number = 0;
  totalCost: number = 0;
  discount: number = 0;
  coupon_code = '';
  finalTotal = 0;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    private cartService: CartService, private productService: ProductService) {
  }

  ionViewWillEnter() {
    this.updateOrderlines();

    if (this.coupon_code) {
      this.applyCoupon();
    }
  }

  ngOnInit() {
    this.cartService.getBalanceAndLoyalty();

    this.cartService.loyaltyPoints$.subscribe(
      data => {
        this.loyalty_point = data;
      },
      err => {
        this.loyalty_point = 0;
      });
    this.cartService.balanceValue$.subscribe(
      data => {
        this.balance = data;
      },
      err => {
        this.balance = 0;
      });
  }

  onClickedOnPromoCode() {
    this.isPromoCodeShown = !this.isPromoCodeShown;
  }

  computeTotalCost(addCoupon = false) {
    this.cartService.dataArray = this.products;

    this.totalCost = this.cartService.calculateTotal();
    this.discount = this.cartService.calculateDiscount(addCoupon);
    this.finalTotal = this.totalCost - this.discount;
  }

  updateOrderlines($event = null) {
    this.cartService.loadOrderlines()
      .then(res => {
        this.updateData();
      }).catch(err => {
        console.error('-> ', err);
      });
  }

  updateData(addCoupon?) {
    let t = this.cartService.getReformedOrderlines() || [];

    this.productService.getProducts(t.map(el => el.product_id))
      .then(res => {
        this.products = [];

        t.forEach(el => {
          const found = res.find(i => i._id === el.product_id);
          const instance = found.instances.find(i => el.instance_id === i._id);
          const color = found.colors.find(i => instance.product_color_id === i._id);

          this.products.push(Object.assign({}, {
            product_id: found._id,
            instance_id: instance._id,
            quantity: el.quantity,
            base_price: found.base_price,
            brand: found.brand,
            color,
            dest: found.dest,
            discount: found.discount,
            name: found.name,
            product_type: found.product_type,
            instance,
            cost: instance.price ? instance.price : found.base_price,
            size: instance.size,
            tags: found.tags,
            count: instance.inventory ? instance.inventory.map(el => el.count).reduce((a, b) => a + b, 0) : 0,
          }));
        });

        const quantityList = this.products.map(el => el.quantity);
        this.cartItemsLength = (quantityList && quantityList.length > 0) ? quantityList.reduce((a, b) => a + b, 0) : 0;

        this.computeTotalCost(addCoupon);
      })
      .catch(err => {
        console.error(err);
        this.products = [];
      })
  }

  formatPrice(p) {
    return priceFormatter(p);
  }

  applyCoupon() {
    this.cartService.addCoupon(this.coupon_code)
      .then((res) => {
        this.updateData(res);
      })
      .catch(err => {
        this.alertCtrl.create({
          title: 'خطا',
          message: 'کد تخفیف وارد شده نامعتبر یا استفاده شده می باشد',
          buttons: [
            {
              text: 'بستن',
              role: 'cancel',
            }
          ]
        }).present();
        console.error('rejected: ', err);
      });
  }

  goToCheckoutPage() {
    this.cartService.coupon_code = this.coupon_code;
    this.navCtrl.push(CheckoutPage, {
      headerData: this.cartService.computeCheckoutTitlePage()
    });
  }
}
