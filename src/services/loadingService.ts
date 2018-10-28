import {Injectable} from "@angular/core";
import {LoadingController} from "ionic-angular";

@Injectable()
export class LoadingService {
  private loading = null;
  private counter = 0;

  constructor(private loadingCtrl: LoadingController) {

  }

  enable(content = 'لطفا صبر کنید ...') {
    if (!this.counter) {
      this.loading = this.loadingCtrl.create({
        content
      });

      this.loading.present();
    }
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