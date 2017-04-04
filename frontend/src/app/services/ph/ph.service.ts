import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {PhDO} from '../../model/ph';
import * as io from 'socket.io-client';

@Injectable()
export class PhService {

  private baseUrl = '';
  private socketUrl = '';
  private socket;

  constructor(private http: Http) {
  }

  getPumpStatus() {
    return new Observable<boolean>(observer => {
      this.socket = io(this.socketUrl);
      this.socket.on('pumpStatusChange', (value) => {
        observer.next(value);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  getPh(): Observable<PhDO> {

    return this.http.get(this.baseUrl + '/getph')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  getPhsInInterval(startDate: number, endDate: number): Observable<PhDO[]> {

    const params: URLSearchParams = new URLSearchParams();
    params.set('datefrom', startDate.toString());
    params.set('dateto', endDate.toString());


    return this.http.get(this.baseUrl + '/getPhinterval', {search: params})
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  setPhValue(phValue: number): Observable<any> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + '/setphvalue', phValue, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
