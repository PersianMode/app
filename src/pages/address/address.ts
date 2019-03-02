import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertController, Navbar, NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {
  GoogleMaps,
  GoogleMap,
  LatLng,
  GoogleMapsEvent, GoogleMapOptions
} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation';
import {CheckoutService} from '../../services/checkout.service';
import {LoadingService} from '../../services/loadingService';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage implements OnInit, AfterViewInit {
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;

  isNew = true;
  address = null;
  anyChanges = false;
  provinceCityList = [];
  cityList = [];
  addressForm: FormGroup;
  formIsDone = false;
  isInventoryAddress = true;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private alertCtrl: AlertController, private http: HttpClient,
              private authService: AuthService, private formBuilder: FormBuilder,
              private checkoutService: CheckoutService, private toastCtrl: ToastController,
              private loadingService: LoadingService, private geolocation: Geolocation) {
  }

  ionViewWillEnter() {
    this.navBar.setBackButtonText('بازگشت');
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.close();
    }
  }

  ngOnInit() {
    this.address = this.navParams.get('address');
    this.isInventoryAddress = this.navParams.get('isInventoryAddress');
    if (this.address && this.address._id)
      this.isNew = false;

    this.http.get(HttpService.assetPrefix + 'province.json').subscribe(
      (info: any) => {
        this.provinceCityList = info;
        if (this.isNew)
          this.cityList = this.provinceCityList[0].cities;
        else
          this.cityList = this.provinceCityList.find(el => el.name === this.address.province).cities;
      }
    );

    this.initForm();
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    const mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.addressForm.controls['lat'].value,
          lng: this.addressForm.controls['long'].value,
        },
        zoom: 18,
        tilt: 30
      }
    };

    let element = this.mapElement.nativeElement;
    this.map = GoogleMaps.create(element, mapOptions);

    this.map.setClickable(true);

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        if (this.isNew) {
          this.geolocation.getCurrentPosition()
            .then(res => {
              this.addressForm.controls['lat'].setValue(res.coords.latitude);
              this.addressForm.controls['long'].setValue(res.coords.longitude);

              this.settingMap(new LatLng(res.coords.latitude, res.coords.longitude));
            })
            .catch(err => {
              console.error(`error in getting current location: ${JSON.stringify(err)}`);
              this.settingMap();
            });
        } else {
          this.settingMap();
        }
      })
      .catch(err => {
        console.error(`error in map ready google event: ${JSON.stringify(err)}`);
      });
  }

  private settingMap(loc?: LatLng) {
    if (!loc && this.isNew)
      loc = new LatLng(35.696491, 51.379926);

    if (!loc) {
      loc = new LatLng(this.addressForm.controls['lat'].value, this.addressForm.controls['long'].value);
    }

    // Move camera
    const options = {
      target: loc,
      zoom: 18,
      tilt: 30,
    };

    this.map.moveCamera(options).catch(err => console.error("error settings camera:", err));

    // Add marker
    this.map.addMarker({
      title: this.isInventoryAddress ? 'محل فروشگاه' : 'محل ارسال سفارش',
      icon: 'red',
      animation: 'DROP',
      position: {
        lat: this.addressForm.controls['lat'].value,
        lng: this.addressForm.controls['long'].value,
      },
      draggable: this.isNew && !this.isInventoryAddress,
    })
      .then((marker: any) => {
        marker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe((data) => {
          this.addressForm.controls['lat'].setValue(data.lat);
          this.addressForm.controls['long'].setValue(data.lng);
        });
      })
      .catch(err => {
        console.error(`error in setting marker for map ${JSON.stringify(err)}`);
      });
  }

  initForm() {
    this.addressForm = this.formBuilder.group({
      recipient_name: [this.isNew || this.isInventoryAddress ? this.authService.userData.name : this.address.recipient_name, [
        Validators.required,
      ]],
      recipient_surname: [this.isNew || this.isInventoryAddress ? this.authService.userData.surname : this.address.recipient_surname, [
        Validators.required
      ]],
      recipient_national_id: [this.isNew || this.isInventoryAddress ? null : this.address.recipient_national_id, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)
      ]],
      recipient_title: [this.isNew || this.isInventoryAddress ? null : this.address.recipient_title, [
        Validators.required,
      ]],
      recipient_mobile_no: [this.isNew || this.isInventoryAddress ? null : this.address.recipient_mobile_no, [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      province: [{value: this.isNew ? "آذربایجان شرقی" : this.address.province, disabled: !this.isNew}, [
        Validators.required,
      ]],
      city: [{value: this.isNew ? "آبش احمد" : this.address.city, disabled: !this.isNew}, [
        Validators.required,
      ]],
      no: [{value: this.isNew ? null : this.address.no, disabled: !this.isNew}, [
        Validators.required,
      ]],
      unit: [{value: this.isNew ? null : this.address.unit, disabled: !this.isNew}, [
        Validators.required,
      ]],
      postal_code: [{value: this.isNew ? null : this.address.postal_code, disabled: !this.isNew}, [
        Validators.required,
      ]],
      district: [{value: this.isNew ? null : this.address.district, disabled: !this.isNew}, [
        Validators.required,
        Validators.maxLength(100),
      ]],
      lat: [{value: this.isNew || !this.address.loc ? 35.696491 : this.address.loc.lat, disabled: !this.isNew}],
      long: [{value: this.isNew || !this.address.loc ? 51.379926 : this.address.loc.long, disabled: !this.isNew}],
      street: [{value: this.isNew ? null : this.address.street, disabled: !this.isNew}, [
        Validators.required,
      ]],
    });

    this.formIsDone = true;
  }

  close() {
    if (this.anyChanges) {
      this.alertCtrl.create({
        title: 'خروج از ویرایش',
        message: 'تغییراتی ذخیره نشده اند. آیا می خواهید تغییرات را ذخیره کنید؟',
        buttons: [
          {
            text: 'لغو',
            role: 'cancel',
          },
          {
            text: 'ذخیره و خروج',
            handler: () => {
              this.submitAddress()
                .then(res => {
                  this.navCtrl.pop();
                })
                .catch(err => {
                  this.toastCtrl.create({
                    message: `خطا در ذخیره سازی آدرس`,
                    duration: 4000
                  }).present();
                  console.error("error in saving address: ", err);
                });
            }
          },
          {
            text: 'خروج',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      }).present();
    } else {
      this.navCtrl.pop();
    }
  }

  fieldChanged() {
    this.anyChanges = false;

    if (this.formIsDone) {
      if (this.isNew)
        this.anyChanges = true;
      else
        Object.keys(this.addressForm.controls).forEach(el => {
          if (el === 'lat' || el === 'long') {
            if (this.addressForm.controls[el].value !== this.address.loc[el])
              this.anyChanges = true;
          } else if (this.addressForm.controls[el].value !== this.address[el])
            this.anyChanges = true;
        });
    }
  }

  changeProvince() {
    const province = this.addressForm.controls['province'].value;
    this.cityList = this.provinceCityList.find(el => el.name === province).cities;
    this.addressForm.controls['city'].setValue(this.cityList[0]);

    this.fieldChanged();
  }

  submitAddress(): Promise<any> {
    if (!this.addressForm.valid)
      return Promise.reject('The form is not valid');

    if (!this.anyChanges)
      return Promise.resolve();

    return new Promise((resolve, reject) => {
      const data = {
        loc: {}
      };

      if (!this.isNew)
        data['_id'] = this.address._id;

      Object.keys(this.addressForm.controls).forEach(el => {
        if (el === 'lat' || el === 'long')
          data['loc'][el] = this.addressForm.controls[el].value;
        else
          data[el] = this.addressForm.controls[el].value;
      });

      this.loadingService.enable({}, 0, () => {
        this.checkoutService.saveAddress(data)
          .then(res => {
            this.anyChanges = false;
            this.loadingService.disable();
            this.loadingService.enable({
              spinner: 'hide',
              content: 'آدرس با موفقیت ثبت شد',
              duration: 1500,
              cssClass: 'select-size-page-header',
            });
            this.loadingService.setOnDismissFunctionality(() => {
              this.navCtrl.pop();
              resolve();
            });
          })
          .catch(err => {
            this.loadingService.disable();
            reject(err);
          });
      });
    });
  }
}
