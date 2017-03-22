import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {UserDO} from "../model/userDO";

@Injectable()
export class AuthService {

  isLoggedIn: boolean = false;
  user: UserDO = null;
  redirectUrl: string;

  login(): Observable<boolean>{
    return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  constructor() { }

}
