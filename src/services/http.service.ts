import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class HttpService {
  public static Host = 'http://localhost:3000';
  serverAddress: string = 'http://localhost:3000/api/';
  userToken = null;

  constructor(private http: HttpClient) {}

  get(url): Observable<any> {
    let headers = new HttpHeaders();
    if(this.userToken)
      headers = headers.append('token', this.userToken);

    return this.http.get(this.serverAddress + url, {observe: 'response', headers: headers}).map(data => data.body);
  }

  put(url, values): Observable<any> {
    let headers = new HttpHeaders();
    if(this.userToken)
      headers = headers.append('token', this.userToken);

    return this.http.put(this.serverAddress + url, values, {observe: 'response', headers: headers}).map(data => data.body);
  }

  post(url, values): Observable<any> {
    let headers = new HttpHeaders();
    if(this.userToken)
      headers = headers.append('token', this.userToken);

    return this.http.post(this.serverAddress + url, values, {observe: 'response', headers: headers}).map(data => data.body);
  }

  delete(url): Observable<any> {
    let headers = new HttpHeaders();
    if(this.userToken)
      headers = headers.append('token', this.userToken);

    return this.http.delete(this.serverAddress + url, {observe: 'response', headers: headers});
  }
}
