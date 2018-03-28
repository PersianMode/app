import {Component} from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';
import {AuthService} from '../../services/auth.service';
import {LoginPage} from '../login/login';
import {FilterProductSize} from "../../components/filter-product-size/filter-product-size";

interface User {
  fullName: string;
  username: string;
  imageUrl: string;

}

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User = {
    fullName: 'ایمان صاحبی',
    username: 'imans77',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Vodafone_Logo_Speechmark.png/240px-Vodafone_Logo_Speechmark.png'
  };

  constructor(public navCtrl: NavController, private authService: AuthService, public popoverCtrl: PopoverController) {

  }

  logout() {
    this.authService.logout();
  }

  demoFilterProductSize() {
    let _popover = this.popoverCtrl.create(FilterProductSize,{selected:['S','XL','9XL']});
    _popover.present();
  }


}
