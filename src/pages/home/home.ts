import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HttpService} from '../../services/http.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit{
  feed_placement : any;

  constructor(public navCtrl: NavController, private httpService: HttpService, private http: HttpClient) {
  }

  ngOnInit() {
    this.httpService.post('page/placement/list', {
      address: 'feed'
    }).subscribe(
      (res) => {
        this.feed_placement = res['placement'];
      },
      (er) => {
        console.error('Cannot check user validation: ', er);

      }
    );
  }
}
