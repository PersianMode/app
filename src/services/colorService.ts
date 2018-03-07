import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class ColorService {
  private colorDictionary = null;
  colorIsReady: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private httpService: HttpService) {
    if (!this.colorDictionary) {
      this.getColorDictionary();
    }
  }

  getColorHexCode(colorName) {
    if (this.colorIsReady._getNow()) {
      return this.colorDictionary[colorName.toLowerCase()];
    } else {
      this.getColorDictionary();
    }
  }

  getColorDictionary() {
    return new Promise((resolve, reject) => {
      this.httpService.get('color/dictionary').subscribe(
        (data) => {
          this.colorDictionary = data;
          this.colorIsReady.next(true);
          resolve();
        },
        (err) => {
          console.error('Cannot get color dictionary from server: ', err);
          reject();
        }
      );
    });
  }
}
