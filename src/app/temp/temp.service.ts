import {Injectable} from "@angular/core";
import {Http, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {TemperatureDO} from "../model/temperatureDO";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {HeaterTempDO} from "../model/heaterTempDO";

@Injectable()
export class TempService {

  constructor(private http: Http) {
  }

  private baseUrl = 'https://iotwithchemtest.herokuapp.com';


  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  getTemp(): Observable<TemperatureDO> {

    console.log(this.baseUrl + "/gettemperature");
    return this.http.get(this.baseUrl + "/gettemperature")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getTempsInInterval(startDate: string, endDate: string): Observable<TemperatureDO[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('datefrom', startDate);
    params.set('dateto', endDate);

    return this.http.get(this.baseUrl + "/gettemperatureinterval", {search: params})
      .map(this.extractData)
      .catch(this.handleError);
  }

  setReadInterval(seconds: number): Observable<boolean> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('upinterval', seconds.toString());

    return this.http.get(this.baseUrl + "/settemperaturesensorsuploadintervall", {search: params})
      .map(this.extractData)
      .catch(this.handleError);
  }

  setHeaterTemp(temp: number): Observable<HeaterTempDO> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('heatertemp', temp.toString());

    return this.http.get(this.baseUrl + "/setheatertemperature", {search: params})
      .map(this.extractData)
      .catch(this.handleError);
  }

  getHeaterTemp(): Observable<number> {

    return this.http.get(this.baseUrl + "/getheatertemperature")
      .map(this.extractData)
      .catch(this.handleError);
  }
}
