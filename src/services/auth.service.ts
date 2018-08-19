import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {Storage} from '@ionic/storage';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class AuthService {
  user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isFullAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isVerified = false;
  private isLoggedIn = false;
  userData = {
    userId: null,
    username: null,
    name: null,
    surname: null,
    mobile_no: null,
  };
  tempData = {
    username: null,
    password: null,
  };

  constructor(private httpService: HttpService, private storage: Storage) {
    this.loadUserBasicData()
      .then((data) => {
        if (data)
          this.httpService.get('validUser').subscribe(
            (res) => {
              this.isLoggedIn = true;
              this.isFullAuthenticated.next(res.is_verified);
            },
            (er) => {
              console.error('Cannot check user validation: ', er);
              this.isLoggedIn = false;
              this.isFullAuthenticated.next(false);
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
          if (data) {
            this.httpService.userToken = data.token;
            delete data.token;
            this.setUserData(data);
            this.user.next(data);
          }

          resolve(data);
        })
        .catch(err => {
          this.user.next(null);
          console.error('Error when loading user data from storage: ', err);
          reject();
        });
    });
  }

  setUserData(data) {
    this.userData = {
      userId: data._id,
      username: data.username,
      name: data.name,
      surname: data.surname,
      mobile_no: data.mobile_no,
    };
  }

  saveUserData(user) {
    this.storage.set('user', user);
  }

  removeUser() {
    this.storage.remove('user');
    this.user.next(null);
  }

  login(username, password, setAuthenticationStatus = true) {
    return new Promise((resolve, reject) => {
      this.httpService.post('app/login', {
        username: username,
        password: password,
      }).subscribe(
        (res) => {
          this.afterLogin(res);
          if(setAuthenticationStatus)
            this.isFullAuthenticated.next(res.is_verified);
          else
            this.isVerified = res.is_verified;          
          resolve();
        },
        (err) => {
          console.error('Cannot login. Error: ', err);
          this.isLoggedIn = false;
          this.isFullAuthenticated.next(false);
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
          this.isLoggedIn = false;
          this.isFullAuthenticated.next(false);
          resolve();
        },
        (err) => {
          console.error('Cannot logout: ', err);
          reject();
        });
    });
  }

  afterLogin(res) {
    this.httpService.userToken = res.token;
    this.isLoggedIn = true;
    this.setUserData(res);
    this.saveUserData(res);
  }

  setVerification(isVerified = false) {
    this.isFullAuthenticated.next(isVerified && this.isLoggedIn);
  }

  applyVerification() {
    this.isFullAuthenticated.next(this.isVerified && this.isLoggedIn);
  }
}
