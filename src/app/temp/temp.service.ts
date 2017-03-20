import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Temperature} from '../model/temperature';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TempService {

  constructor (private http: Http) {}

  private url = 'https://iotwithchemtest.herokuapp.com/gettemperature';

  getTemp() : Observable<Temperature> {

    return this.http.get(this.url)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
