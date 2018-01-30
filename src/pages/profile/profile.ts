import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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
    fullName: 'Iman Sahebi',
    username: 'imans77',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Vodafone_Logo_Speechmark.png/240px-Vodafone_Logo_Speechmark.png'
  };

  constructor(public navCtrl: NavController) {

  }

}
