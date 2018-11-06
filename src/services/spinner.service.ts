import {Injectable} from '@angular/core';
import {LoadingController} from "ionic-angular";

@Injectable()
export class SpinnerService {

  constructor(public loadingCtrl: LoadingController) {
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 500);
  }
}
