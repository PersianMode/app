import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PageService} from '../../services/page.service';
import {HttpService} from '../../services/http.service';
import {LoadingService} from '../../services/loadingService';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  feed_placement: any;
  placements$: any;

  constructor(public navCtrl: NavController, private pageService: PageService,
      private loadingService: LoadingService) {
  }

  ionViewWillEnter() {
    this.placements$ = this.pageService.placement$;
    
    this.loadingService.enable({}, 0, () => {
      this.pageService.getPage('feed');

      this.placements$.subscribe(res => {
        this.feed_placement = res;
        this.feed_placement.sort((a, b) => {
          if (a.info.row > b.info.row)
            return 1;
          else if (a.info.row < b.info.row)
            return -1;
          return 0;
        });
        this.loadingService.disable();
      }, err => {
        console.error(err);
        this.loadingService.disable();
      });
    });
  }

  loadImage(imgUrl: string) {
    if (imgUrl) {
      imgUrl = imgUrl[0] === '/' ? imgUrl : '/' + imgUrl;
      return HttpService.addHost(imgUrl);
    }
  }
}
