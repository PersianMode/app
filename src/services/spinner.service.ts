import {Injectable} from '@angular/core';
import {LoadingController} from "ionic-angular";

@Injectable()
export class SpinnerService {

  loading;
  constructor(public loadingCtrl: LoadingController) {
  }

  enable() {
     this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
    });
    this.loading.present();
  }
  disable() {
      this.loading.dismiss();
  }
}
