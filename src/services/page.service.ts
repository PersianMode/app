import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IPageInfo} from '../interfaces/ipageInfo.interface';


@Injectable()
export class PageService {
  private cache: any = {};
  placement$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  pageInfo$: ReplaySubject<IPageInfo> = new ReplaySubject<IPageInfo>(1);

  constructor(private httpService: HttpService) {

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
        }
      );
    } else {
      this.emitPlacements(this.cache[pageName].placement);
      this.emitPageInfo(this.cache[pageName].page_info);
    }
  }

}
