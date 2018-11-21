import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {Storage} from '@ionic/storage';

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
    is_preferences_set: null,
  };
  tempData = {
    username: null,
    password: null,
    gender: null,
  };

  constructor(private httpService: HttpService, private storage: Storage) {}

  public checkIsUserValid() {
    return new Promise((resolve, reject) => {
      this.loadUserBasicData()
        .then((data) => {
          if (data) {
            return this.checkValidation().catch(err => {
              console.error('cannot check user validation: ', err);
              return Promise.reject('');
            });
          }

          return Promise.reject('');
        })
        .then(res => {
          resolve();
        })
        .catch(err => {
          console.error('Error: ', err);
          reject();
        });
    });
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

  checkValidation() {
    return new Promise((resolve, reject) => {
      this.httpService.get('validUser').subscribe(
        res => {
          this.afterLogin(res, false).then(data => {
            this.isLoggedIn = true;
            this.isFullAuthenticated.next(res.is_verified);
            resolve(res);
          });
        }, err => {
          this.isLoggedIn = false;
          this.isFullAuthenticated.next(false);
          reject(err);
        }
      );
    })
  }

  activateEmail(link) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`user/activate/link/${link}`).subscribe(
        data => {
          resolve(data); // returns is_verified level too
        }, err => {
          console.error('could not activate via this link: ', err);
          reject(err);
        }
      );
    });
  }

  setUserData(data) {
    this.userData = {
      userId: data._id,
      username: data.username,
      name: data.name,
      surname: data.surname,
      mobile_no: data.mobile_no,
      is_preferences_set: data.is_preferences_set,
    };
  }

  saveUserData(user) {
    this.storage.set('user', user);
  }

  removeUser() {
    this.storage.remove('user');
    this.user.next(null);
    this.resetUserData();
  }

  resetUserData() {
    this.userData = {
      userId: null,
      username: null,
      name: null,
      surname: null,
      mobile_no: null,
      is_preferences_set: null,
    };
  }

  login(username, password, setAuthenticationStatus = true) {
    return new Promise((resolve, reject) => {
      this.httpService.post('app/login', {
        username: username,
        password: password,
      }).subscribe(
        (res) => {
          this.afterLogin(res).then(data => {
            if (setAuthenticationStatus)
              this.isFullAuthenticated.next(res.is_verified);
            else
              this.isVerified = res.is_verified;
            resolve(res);
          });
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

  afterLogin(res, hasToken = true) {
    return new Promise((resolve, reject) => {
      if (hasToken)
        return resolve(res);

      this.storage.get('user')
        .then(theUser => {
          if (!theUser)
            return reject('no user in LS!');

          res.token = theUser.token;
          resolve(res);
        })
        .catch(err => reject(err));
    })
      .then(res => {
        if (!res['name']) // just to keep things integrated
          res['name'] = res['first_name'];
        this.httpService.userToken = res['token'];
        this.isLoggedIn = true;
        this.setUserData(res);
        this.saveUserData(res);
        return Promise.resolve(res);
      })
      .catch(err => {
        console.error('internal error:', err);
        return Promise.reject(err);
      });
  }

  setVerification(isVerified = false) {
    this.isFullAuthenticated.next(isVerified && this.isLoggedIn);
  }

  // applyVerification() {
  //   console.log('verification for the initiate data INPUT: ', this.isVerified, this.isLoggedIn);
  //   this.isFullAuthenticated.next(this.isVerified && this.isLoggedIn);
  // }
}
