import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import {JobDO} from "../model/job";

@Injectable()
export class JobService {

  constructor(private http: Http) {
  }

  private baseUrl = 'https://iotwithchembackend.herokuapp.com';

  private static extractData(res: Response) {
    return res.json();
  }

  private static handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  getJob(): Observable<JobDO> {

    return this.http.get(this.baseUrl + "/getjob")
      .map(JobService.extractData)
      .catch(JobService.handleError);
  }

  setJob(newJob: JobDO): Observable<JobDO> {

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + "/setjob", newJob, options)
      .map(JobService.extractData)
      .catch(JobService.handleError);
  }
}
