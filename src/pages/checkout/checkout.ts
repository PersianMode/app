import {Component, OnInit, ViewChild} from '@angular/core';
import {Navbar, NavController, NavParams, ToastController, AlertController} from "ionic-angular";
import {CheckoutService} from '../../services/checkout.service';
import {PaymentType} from '../../enum/payment.type.enum';
import {AddressPage} from '../address/address';
import {ProductService} from '../../services/productService';
import {LoadingService} from '../../services/loadingService';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  total = 0;
  discount = 0;
  usedBalance = 0;
  usedLoyaltyPoint = 0;
  userBalance = 0;
  userLoyaltyPointValue = 0;
  headerData;
  addressIsSet = false;
  paymentType = PaymentType;
  earnedLoyaltyPoint = 0;
  deliveryCost = 0;
  deliveryDiscount = 0;
  showCostLabel = false;
  checkoutHasError = false;
  private itemList = [
    {
      item: 'payment',
      value: false,
    },
    {
      item: 'address',
      value: false,
    }
  ];

  constructor(private navParams: NavParams, private toastCtrl: ToastController,
              private checkoutService: CheckoutService, private navCtrl: NavController,
              private loadingService: LoadingService, private productService: ProductService,
              private alertCtrl: AlertController) {
  }

  ionViewWillEnter() {
    this.navBar.setBackButtonText('بازگشت');
  }

  ngOnInit() {
    this.headerData = this.navParams.get('headerData') || {};
    this.checkoutService.dataIsReady.subscribe(
      (data) => {
        if (data) {
          const tempTotalDiscount = this.checkoutService.getTotalDiscount();
          this.total = tempTotalDiscount.total;
          this.discount = tempTotalDiscount.discount;
        }
      }
    );

    this.checkoutService.getLoyaltyBalance();

    this.checkoutService.loyaltyPointValue$.subscribe(
      data => {
        this.userLoyaltyPointValue = data;
      },
      err => {
        this.userLoyaltyPointValue = 0;
      });

    this.checkoutService.balance$.subscribe(
      data => {
        this.userBalance = data;
      },
      err => {
        this.userBalance = 0;
      });

    this.addressIsSet = this.checkoutService.selectedAddress ? true : false;

    this.loadingService.enable({content: 'در حال دریافت اطلاعات وفاداری ...'});

    Promise.all([
      this.checkoutService.getAddLoyaltyPoints(),
      this.checkoutService.getLoyaltyGroup(),
    ])
      .then(res => {
        this.loadingService.disable();
      })
      .catch(err => {
        this.toastCtrl.create({
          message: 'قادر به دریافت لیست گروه های وفاداری نیستیم. دوباره تلاش کنید',
          duration: 3200,
        }).present();
        this.loadingService.disable();
      });
  }

  itemIsOpen(item) {
    const index = this.itemList.findIndex(el => el.item.toLowerCase() === item.toLowerCase());
    return index < 0 ? false : this.itemList[index].value;
  }

  toggleItem(item) {
    const index = this.itemList.findIndex(el => el.item.toLowerCase() === item.toLowerCase());
    if (index < 0)
      return;
    this.itemList[index].value = !this.itemList[index].value;
  }

  getSelectedPaymentType() {
    return this.checkoutService.selectedPaymentType;
  }

  setPayment(data) {
    this.usedLoyaltyPoint = 0;
    this.usedBalance = 0;

    if (data === this.paymentType.balance)
      this.usedBalance = this.userBalance;
    else if (data === this.paymentType.loyaltyPoint)
      this.usedLoyaltyPoint = this.userLoyaltyPointValue;

    this.checkoutService.selectedPaymentType = data;

    this.calculateEarnPoint();
  }

  changeAddress(data) {
    this.checkoutService.setAddress(data.selectedAddress, data.isCC, data.duration, data.delivery_time);
    this.addressIsSet = data.isCC ? !!data.selectedAddress : !!(data.selectedAddress && data.duration && data.delivery_time);

    this.calculateEarnPoint();

    this.showCostLabel = !data.isCC;

    if (!data.isCC && data.duration)
      this.calculateDiscount(data.duration._id);
  }

  showAddressDetails(data) {
    this.navCtrl.push(AddressPage, data);
  }

  placeOrder() {
    this.finalCheck()
      .then(res => {
        this.checkoutService.checkout()
          .then(res => {
            this.alertCtrl.create({
              title: 'ثبت سفارش',
              subTitle: 'سفارش شما به موفقیت ثبت شد',
            }).present();
            this.navCtrl.popToRoot();
          })
          .catch(err => {
            this.alertCtrl.create({
              title: 'خطا در ثبت سفارش',
              subTitle: 'در ثبت سفارش خطایی رخ داده است. دوباره تلاش کنید',
              buttons: ['قبول'],
            }).present();
          });
      })
      .catch(err => {

      })
  }

  calculateEarnPoint() {
    this.earnedLoyaltyPoint = this.checkoutService.calculateEarnPoint();
  }

  calculateDiscount(durationId) {
    if (durationId) {
      this.checkoutService.calculateDeliveryDiscount(durationId)
        .then((res: any) => {
          this.deliveryCost = res.res_delivery_cost;
          this.deliveryDiscount = res.res_delivery_discount;
        })
        .catch(err => {
          console.error('error occured in getting delivery cost and discount', err);
        });
    }
  }

  finalCheck() {
    return new Promise((resolve, reject) => {
      this.checkoutService.finalCheck().subscribe(res => {
          let changeMessage = ''
          const soldOuts = res.filter(x => x.errors && x.errors.length && x.errors.includes('soldOut'));
          const discountChanges = res.filter(x => x.warnings && x.warnings.length && x.warnings.includes('discountChanged'));
          const priceChanges = res.filter(x => x.warnings && x.warnings.length && x.warnings.includes('priceChanged'));
          if ((soldOuts && soldOuts.length) ||
            (discountChanges && discountChanges.length) ||
            (priceChanges && priceChanges.length)) {
            changeMessage = '';

            if (!!soldOuts && !!soldOuts.length)
              changeMessage = 'متاسفانه برخی از محصولات به پایان رسیده اند';
            else if (discountChanges && discountChanges.length)
              changeMessage = 'برخی از تخفیف ها تغییر کرده است';
            else if (priceChanges && priceChanges.length)
              changeMessage = 'برخی از قیمت ها تغییر کرده است';

            this.productService.updateProducts(res);
            if (changeMessage) {
              this.alertCtrl.create({
                title: 'تغییر اطلاعات',
                subTitle: 'متاسفانه مشخصات برخی از موارد سبد خرید شما مانند موجودی تغییر کرده است. لطفا موارد را تصحیح و دوباره اقدام به خرید نمایید',
                buttons: ['قبول']
              }).present();
              this.checkoutHasError = true;
              reject();
            } else {
              this.checkoutHasError = false;
              resolve();
            }
          } else {
            resolve();
          }
        },
        err => {
          reject();
        });
    });
  }
}
