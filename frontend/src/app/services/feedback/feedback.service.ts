import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class FeedbackService {

  private baseUrl = '';

  constructor(private http: Http) {
  }

  private static extractData(res: Response) {
    return res.json();
  }

  private static handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  sendFeedback(from: string, message: string): Observable<boolean> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + '/sendFeedback', {"from": from, "message": message}, options)
      .map(FeedbackService.extractData)
      .catch(FeedbackService.handleError);
  }

}
