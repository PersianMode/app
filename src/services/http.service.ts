import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class HttpService {
  // NOTE: choose one of the options below for custom profiles
  // public static Host = "http://10.0.2.2:3000";     // -> use this for testing in android emulator
  // public static Host = "http://192.168.1.108:3000";// -> use this for testing in android real device when server is running in computer on the local IP on the same network that the mobile is
  // public static Host = "http://173.249.11.153";    // -> use this for production in real server
  // public static Host = "http://bankofstyle.com";   // -> use this for production in real server
  public static Host = "http://localhost:3000";    // -> use this for testing in browser in windows

  // NOTE: choose one of the options below for custom profiles
  public static assetPrefix = '../../assets/';  // -> use this for testing in browser with ionic serve, etc.
  // public static assetPrefix = 'assets/';        // -> use this for testing in real device or when building
  serverAddress: string = HttpService.Host + "/api/";
  public static PRODUCT_IMAGE_PATH = "images/product-image";

  userToken = null;

  constructor(private http: HttpClient) {
  }

  get(url: any): Observable<any> {
    let headers: any = new HttpHeaders();
    if (this.userToken) {
      headers = headers.append("token", this.userToken);
    }

    return this.http.get(this.serverAddress + url, {
      observe: "response",
      headers: headers
    }).map(data => data.body);
  }

  put(url: any, values: any): Observable<any> {
    let headers: any = new HttpHeaders();
    if (this.userToken) {
      headers = headers.append("token", this.userToken);
    }

    return this.http.put(this.serverAddress + url, values, {
      observe: "response",
      headers: headers
    }).map(data => data.body);
  }

  post(url: any, values: any): Observable<any> {
    let headers: any = new HttpHeaders();
    if (this.userToken) {
      headers = headers.append("token", this.userToken);
    }

    return this.http.post(this.serverAddress + url, values, {
      observe: "response",
      headers: headers
    }).map(data => data.body);
  }

  delete(url: any): Observable<any> {
    let headers: any = new HttpHeaders();
    if (this.userToken) {
      headers = headers.append("token", this.userToken);
    }

    return this.http.delete(this.serverAddress + url, {
      observe: "response",
      headers: headers
    });
  }

  static addHost(url) {
    return url.includes(HttpService.Host) ? url : HttpService.Host + url;
  }
}
