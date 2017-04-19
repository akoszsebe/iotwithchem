import {inject, TestBed} from '@angular/core/testing';

import {JobService} from './job.service';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';


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

        const mockResponse = {jobStartDate: 2000100, jobEndDate: 2000200, jobDescription: 'Test job'};

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

        const job = {jobStartDate: 2000100, jobEndDate: 2000200, jobDescription: 'Test job'};
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
