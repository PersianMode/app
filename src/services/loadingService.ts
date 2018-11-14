import {Injectable} from "@angular/core";
import {LoadingController} from "ionic-angular";

@Injectable()
export class LoadingService {
  private loading = null;
  private counter = 0;
  private baseConfig = {
    content: 'لطفاً صبر کنید'
  };

  constructor(private loadingCtrl: LoadingController) {

  }

  enable(config = {}, timeout = 500, callBack = null) {
    if (!this.counter) {
      const conf = Object.assign({spinner: 'crescent'}, Object.keys(config).length ? config : this.baseConfig);
      this.loading = this.loadingCtrl.create(conf);
      this.loading.present();
    }

    if(!config || !config['duration']) {
      this.counter++;
    }

    if(callBack) {
      setTimeout(callBack, +timeout);
    }
  }

  setOnDismissFunctionality(f) {
    this.loading.onDidDismiss(f);
  }

  disable() {
    if (this.counter > 0) {
      this.counter--;
    }

    if (!this.counter) {
      this.loading.dismiss().catch(err => {
        console.error('-> ', err);
      });
    }
  }
}