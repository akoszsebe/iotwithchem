import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {Http, Response} from '@angular/http';

@Injectable()
export class DeviceService {

  private socketUrl = '';
  private socket;

  private static extractData(res: Response) {
    return res.json().alive;
  }

  private static handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  constructor(private http: Http) {
  }


  getDeviceStatusChanges() {
    return new Observable<boolean>(observer => {
      this.socket = io(this.socketUrl);
      this.socket.on('pi connected', (value) => {
        observer.next(value);
      });
      this.socket.on('pi disconnected', (value) => {
        observer.next(value);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  getDeviceStatus(): Observable<boolean> {
    return this.http.get(this.socketUrl + '/getDeviceStatus')
      .map(DeviceService.extractData)
      .catch(DeviceService.handleError);
  }

}
