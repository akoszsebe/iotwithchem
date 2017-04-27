import {inject, TestBed} from '@angular/core/testing';

import {JobService} from './job.service';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {JobDO} from '../../model/job';

describe('JobService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobService, {provide: XHRBackend, useExisting: MockBackend}, MockBackend],
      imports: [HttpModule]
    });
  });

  it('should ...', inject([JobService], (service: JobService) => {
    expect(service).toBeTruthy();
  }));

  describe('getJob()', () => {

    it('should return an Observable<JobDO>', inject([JobService, MockBackend],
      (service: JobService, backend: MockBackend) => {

        const mockResponse = new JobDO(2000100, 2000200, 'Test job', 30, 5, 7, 5);

        prepareResponse(backend, mockResponse);

        service.getJob().subscribe((job) => {
          expect(job.jobStartDate).toEqual(2000100);
          expect(job.jobEndDate).toEqual(2000200);
          expect(job.jobDescription).toEqual('Test job');
        });
      }));
  });


  describe('setJob()', () => {

    it('should return the newly set job as Observable<JobDO>', inject([JobService, MockBackend],
      (service: JobService, backend: MockBackend) => {

        const job = new JobDO(2000100, 2000200, 'Test job', 30, 5, 7, 5);
        const mockResponse = job;

        prepareResponse(backend, mockResponse);

        service.setJob(job).subscribe((job) => {
          expect(job.jobStartDate).toEqual(2000100);
          expect(job.jobEndDate).toEqual(2000200);
          expect(job.jobDescription).toEqual('Test job');
        });
      }));
  });


  function prepareResponse(backend, mockResponse) {
    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    })
  }

});
