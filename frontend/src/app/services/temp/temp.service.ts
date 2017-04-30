import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, ResponseContentType, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {TemperatureDO} from '../../model/temperature';
import {SensorDO} from '../../model/sensor';
import * as io from 'socket.io-client';
import * as fileSaver from 'file-saver';

@Injectable()
export class TempService {

  private baseUrl = '';

  private socketUrl = '';
  private socket;


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

    const params: URLSearchParams = new URLSearchParams();
    params.set('datefrom', startDate.toString());
    params.set('dateto', endDate.toString());

    return this.http.get(this.baseUrl + '/gettempsbetween', {search: params})
      .map(TempService.extractData)
      .catch(TempService.handleError);
  }

  exportTempsInInterval(startDate: number, endDate: number) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('datefrom', startDate.toString());
    params.set('dateto', endDate.toString());

    this.http.get(this.baseUrl + '/exporttempsbetween', {search: params, responseType: ResponseContentType.Blob}).subscribe(
      (response) => {
        const blob = new Blob([response.blob()], {type: 'application/vnd.ms-excel'});
        const filename = `temp-${new Date()}.xlsx`;
        fileSaver.saveAs(blob, filename);
      });
  }

  setReadInterval(seconds: number): Observable<SensorDO> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + '/settempuploadinterval', {'upinterval': seconds}, options)
      .map(TempService.extractData)
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
