import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {PhDO} from "../model/phDO";

@Injectable()
export class PhService {

  constructor(private http: Http) {
  }

  private url = 'https://iotwithchemtest.herokuapp.com/getph';

  getPh(): Observable<PhDO> {

    return this.http.get(this.url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
