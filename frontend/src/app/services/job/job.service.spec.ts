import {inject, TestBed} from '@angular/core/testing';

import {JobService} from './job.service';
import {Http, HttpModule} from "@angular/http";

describe('JobService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobService],
      imports: [HttpModule]
    });
  });

  it('should ...', inject([JobService], (service: JobService) => {
    expect(service).toBeTruthy();
  }));
});
