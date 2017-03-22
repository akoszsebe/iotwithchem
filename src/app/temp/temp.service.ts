import {Injectable} from "@angular/core";
import {Http, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {TemperatureDO} from "../model/temperatureDO";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class TempService {

  constructor(private http: Http) {
  }

  private baseUrl = 'https://iotwithchemtest.herokuapp.com';

  getTemp(): Observable<TemperatureDO> {

    console.log(this.baseUrl + "/gettemperature");
    return this.http.get(this.baseUrl + "/gettemperature")
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getTempsInInterval(startDate: string, endDate: string): Observable<TemperatureDO[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('datefrom', startDate);
    params.set('dateto', endDate);

    return this.http.get(this.baseUrl + "/gettemperatureinterval", {search: params})
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
