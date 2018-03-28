import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HttpService} from '../../services/http.service';
import {HttpClient} from '@angular/common/http';
import {PageService} from '../../services/page.service';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage{
  feed_placement : any;
  placements$: any;

  constructor(public navCtrl: NavController, private pageService: PageService, private http: HttpClient) {
  }

  ionViewWillEnter(){

    this.placements$ = this.pageService.placement$;

    this.pageService.getPage('feed');

    this.placements$.subscribe(res => {
      this.feed_placement = res;
    },err => {
      console.error(err);

    })


  }
}
