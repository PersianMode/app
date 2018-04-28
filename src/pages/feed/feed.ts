import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PageService} from '../../services/page.service';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  feed_placement: any;
  placements$: any;

  constructor(public navCtrl: NavController, private pageService: PageService) {
  }

  ionViewWillEnter() {

    this.placements$ = this.pageService.placement$;

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
    }, err => {
      console.error(err);

    })


  }

  loadImage(imgUrl: string) {
    return HttpService.addHost(imgUrl);
  }
}
