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

  private static extractData(res: Response) {
    return res.json();
  }

  private static handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

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
      .map(PhService.extractData)
      .catch(PhService.handleError);
  }

  getPhsInInterval(startDate: number, endDate: number): Observable<PhDO[]> {

    const params: URLSearchParams = new URLSearchParams();
    params.set('datefrom', startDate.toString());
    params.set('dateto', endDate.toString());


    return this.http.get(this.baseUrl + '/getPhinterval', {search: params})
      .map(PhService.extractData)
      .catch(PhService.handleError);
  }

  setPhValue(phValue: number): Observable<any> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + '/setphvalue', {'phValue': phValue}, options)
      .map(PhService.extractData)
      .catch(PhService.handleError);
  }
}
