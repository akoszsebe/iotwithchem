import {inject, TestBed} from "@angular/core/testing";
import {PhService} from "./ph.service";
import {HttpModule, Response, ResponseOptions, XHRBackend} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";

describe('PhService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: XHRBackend, useExisting: MockBackend}, MockBackend, PhService],
      imports: [HttpModule]
    });
  });

  it('should ...', inject([PhService], (service: PhService) => {
    expect(service).toBeTruthy();
  }));


  describe('getPh()', () => {

    it('should return an Observable<PhDO>', inject([PhService, MockBackend],
      (service: PhService, backend: MockBackend) => {

        const mockResponse = {raspberryid: '1', sensorid: '1', phvalue: 7, phdate: 2123123};

        prepareResponse(backend, mockResponse);

        service.getPh().subscribe((ph) => {
          expect(ph.phvalue).toEqual(7);
          expect(ph.phdate).toEqual(2123123);
          expect(ph.raspberryid).toEqual('1');
          expect(ph.sensorid).toEqual('1');
        });
      }));
  });

  describe('getPhsInInterval()', () => {

    it('should return a list of Observable<PhDO>', inject([PhService, MockBackend],
      (service: PhService, backend: MockBackend) => {

        const mockResponse = [
          {raspberryid: '1', sensorid: '1', phvalue: 5, phdate: 2123123},
          {raspberryid: '1', sensorid: '1', phvalue: 6, phdate: 2123124},
          {raspberryid: '1', sensorid: '1', phvalue: 7, phdate: 2123126}
        ];

        prepareResponse(backend, mockResponse);

        service.getPhsInInterval(2000000, 2200000).subscribe((phs) => {
          expect(phs[0].phvalue).toEqual(5);
          expect(phs[1].phvalue).toEqual(6);
          expect(phs[2].phvalue).toEqual(7);
          expect(phs.length).toEqual(3);
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
