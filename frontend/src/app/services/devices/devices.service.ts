import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, ResponseContentType, URLSearchParams} from '@angular/http';
import {DevicesDO} from '../../models/devices';
import {AppSettings} from '../../models/app-settings';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DevicesService {

  private baseUrl = AppSettings.BASE_URL;


  private static extractData(res: Response) {
    return res.json();
  }

  private static handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  constructor(private http: Http) {
  }

  getDevices(): Observable<DevicesDO> {

    console.log(this.baseUrl + '/api/frontEnd/getDevices');
    return this.http.get(this.baseUrl + '/api/frontEnd/getDevices')
      .map(DevicesService.extractData)
      .catch(DevicesService.handleError);
  }

}
