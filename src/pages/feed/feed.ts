import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PageService} from '../../services/page.service';
import {HttpService} from '../../services/http.service';
import {GoogleMap, GoogleMaps} from '@ionic-native/google-maps';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage implements AfterViewInit{
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  feed_placement: any;
  placements$: any;

  constructor(public navCtrl: NavController, private pageService: PageService,
              private _googleMaps: GoogleMaps) {
  }

  ionViewWillEnter() {

    this.placements$ = this.pageService.placement$;

    this.pageService.getPage('feed');

    this.placements$.subscribe(res => {
      this.feed_placement = res;
    }, err => {
      console.error(err);

    })


  }

  ngAfterViewInit() {
    let element = this.mapElement.nativeElement;
    this.map = this._googleMaps.create(element);
  }

  loadImage(imgUrl: string) {
    return HttpService.addHost(imgUrl);
  }
}
