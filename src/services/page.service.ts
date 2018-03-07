import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {IPageInfo} from '../interfaces/ipageInfo.interface';
import {Subject} from 'rxjs/Subject';
import {ToastController} from 'ionic-angular';


@Injectable()
export class PageService {
  private cache: any = {};
  placement$: Subject<any[]> = new Subject<any[]>();
  pageInfo$: Subject<IPageInfo> = new Subject<IPageInfo>();

  constructor(private httpService: HttpService, private toastCtrl: ToastController) {

  }

  private emitPlacements(placements) {
    this.placement$.next(placements);
  }

  private emitPageInfo(info: IPageInfo) {
    this.pageInfo$.next(info);
  }

  getPage(pageName) {
    if (!this.cache[pageName]) {
      this.httpService.post('page', {address: pageName}).subscribe(
        (data: any) => {
          this.cache[pageName] = {};
          if (data && data.placement) {
            this.cache[pageName].placement = data.placement;
            this.emitPlacements(this.cache[pageName].placement);
          }
          if (data && data.page_info) {
            this.cache[pageName].page_info = data.page_info;
            this.emitPageInfo(this.cache[pageName].page_info);
          }
        }, err => {
          console.log('err: ', err);
          this.toastCtrl.create({
            message: 'این صفحه در حال حاضر موجود نمی باشد',
            duration: 3200,
          }).present();
        }
      );
    } else {
      if (this.cache[pageName].placement) this.emitPlacements(this.cache[pageName].placement);
      if (this.cache[pageName].page_info) this.emitPageInfo(this.cache[pageName].page_info);
    }
  }

}
