import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {TemperatureDO} from "../model/temperatureDO";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class TempService {

  constructor(private http: Http) {
  }

  private url = 'https://iotwithchemtest.herokuapp.com/gettemperature';

  getTemp(): Observable<TemperatureDO> {

    return this.http.get(this.url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
