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

  enable(config = {}) {
    if (!this.counter) {
      this.loading = this.loadingCtrl.create(Object.keys(config).length ? config : this.baseConfig);
      this.loading.present();
    }

    if(!config || !config['duration']) {
      this.counter++;
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