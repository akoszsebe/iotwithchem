import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {UserDO} from '../../model/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {

  user: UserDO;
  redirectUrl: string;

  private baseUrl = '';

  private extractData(res: Response) {
    console.log(res);
    this.user = res.json().user;
    return res.json();
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }


  /*
   login(): Observable<any> {
   return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
   return this.http.get(this.baseUrl + "/login/facebook");
   }
   */

  logout(): void {
    /*this.isLoggedIn = false;*/
  }

  // isLoggedIn(): Observable<boolean> {
  //   return this.checkAuthentication().map(user => {
  //       return user !== null;
  //     }
  //   );
  // }

  checkAuthentication(): Observable<any> {
    return this.http.get(this.baseUrl + '/checkAuth')
      .map(this.extractData)
      .catch(this.handleError);
  }

  constructor(private http: Http) {
    this.checkAuthentication().subscribe(user => console.log(user));
  }

}
