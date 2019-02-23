import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {ProductDetailPage} from '../products/product-detail/product-detail';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'page-music-player',
  templateUrl: 'music-player.html',
})
export class musiPlayerPage implements OnInit {

  constructor(public navCtrl: NavController, private authService: AuthService,
              private orderService: OrderService) {

  }

  ngOnInit() {
  }

}

