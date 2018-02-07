import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {Storage} from '@ionic/storage';

@Injectable()
export class AuthService {
  user: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private httpService: HttpService, private storage: Storage) {
    this.loadUserBasicData();
  }

  loadUserBasicData() {
    this.storage.get('user')
      .then(data => {
        this.user.next(data);
      })
      .catch(err => {
        this.user.next(null);
        console.error('Error when loading user data from storage: ', err);
      });
  }

  saveUserData(user) {
    this.storage.set('user', user);
  }

  removeUser() {
    this.storage.remove('user');
    this.user.next(null);
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      this.httpService.post('login', {
        username: username,
        password: password,
      }).subscribe(
        (res) => {
          this.saveUserData(res);
          resolve();
        },
        (err) => {
          console.error('Cannot login. Error: ', err);
          reject(err);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.httpService.get('logout').subscribe(
        (res) => {
          this.removeUser();

          resolve();
        },
        (err) => {
          console.error('Cannot logout: ', err);

          reject();
        });
    });
  }
}
