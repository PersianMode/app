import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {Storage} from '@ionic/storage';

@Injectable()
export class AuthService {
  user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpService: HttpService, private storage: Storage) {
    this.loadUserBasicData()
      .then(() => {
        this.httpService.get('validUser').subscribe(
          (res) => {
            console.log(res);
            this.isLoggedIn.next(true);
          },
          (er) => {
            console.error('Cannot check user validation: ', er);
          }
        );
      })
      .catch(err => {
        console.error('Error: ', err);
      })
  }

  loadUserBasicData() {
    return new Promise((resolve, reject) => {
      this.storage.get('user')
        .then(data => {
          this.httpService.userToken = data.token;
          delete data.token;
          this.user.next(data);
          resolve();
        })
        .catch(err => {
          this.user.next(null);
          console.error('Error when loading user data from storage: ', err);
          reject();
        });
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
      this.httpService.post('app/login', {
        username: username,
        password: password,
      }).subscribe(
        (res) => {
          this.httpService.userToken = res.token;
          this.saveUserData(res);
          this.isLoggedIn.next(true);
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
          this.httpService.userToken = null;
          resolve();
        },
        (err) => {
          console.error('Cannot logout: ', err);
          reject();
        });
    });
  }
}
