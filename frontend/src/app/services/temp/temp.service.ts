import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {TemperatureDO} from '../../model/temperature';
import {SensorDO} from '../../model/sensor';
import * as io from 'socket.io-client';

@Injectable()
export class TempService {

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

  /* sendMessage(message) {
   // Make sure the "add-message" is written here because this is referenced in on() in our server
   this.socket.emit('add-message', message);
   }*/

  getHeaterStatus() {
    return new Observable<boolean>(observer => {
      this.socket = io(this.socketUrl);
      this.socket.on('heaterStatusChange', (value) => {
        observer.next(value);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  getTemp(): Observable<TemperatureDO> {

    console.log(this.baseUrl + '/gettemperature');
    return this.http.get(this.baseUrl + '/gettemperature')
      .map(TempService.extractData)
      .catch(TempService.handleError);
  }

  getTempsInInterval(startDate: number, endDate: number): Observable<TemperatureDO[]> {

    console.log(startDate);
    const params: URLSearchParams = new URLSearchParams();
    params.set('datefrom', startDate.toString());
    params.set('dateto', endDate.toString());

    return this.http.get(this.baseUrl + '/gettemperatureinterval', {search: params})
      .map(TempService.extractData)
      .catch(TempService.handleError);
  }

  setReadInterval(seconds: number): Observable<boolean> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + '/settemperaturesensorsuploadinterval', {'upinterval': seconds}, options)
      .map((res: Response) => {
        return res.json().sent;
      })
      .catch(TempService.handleError);
  }

  setHeaterTemp(temp: number): Observable<SensorDO> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + '/setheatertemperature', {'heatertemp': temp}, options)
      .map(TempService.extractData)
      .catch(TempService.handleError);
  }

  getHeaterTemp(): Observable<SensorDO> {

    return this.http.get(this.baseUrl + '/getheatertemperature')
      .map(TempService.extractData)
      .catch(TempService.handleError);
  }

  getOldestReadDates(): Observable<any> {
    return this.http.get(this.baseUrl + '/getoldestreaddates')
      .map(TempService.extractData)
      .catch(TempService.handleError);
  }
}
