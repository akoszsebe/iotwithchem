import {inject, TestBed} from '@angular/core/testing';
import {TempService} from './temp.service';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {SensorDO} from '../../model/sensor';

describe('TempService', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: XHRBackend, useExisting: MockBackend}, MockBackend, TempService],
      imports: [HttpModule]
    });
  });


  it('should ...', inject([TempService], (service: TempService) => {
    expect(service).toBeTruthy();
  }));

  describe('getTemp()', () => {

    it('should return an Observable<TemperatureDO>', inject([TempService, MockBackend],
      (service: TempService, backend: MockBackend) => {

        const mockResponse = {raspberryid: '1', sensorid: '1', tempvalue: 25, tempdate: 2123123};

        prepareResponse(backend, mockResponse);

        service.getTemp().subscribe((temp) => {
          expect(temp.tempvalue).toEqual(25);
          expect(temp.tempdate).toEqual(2123123);
          expect(temp.raspberryid).toEqual('1');
          expect(temp.sensorid).toEqual('1');
        });
      }));
  });

  describe('getTempsInInterval()', () => {

    it('should return a list of Observable<TemperatureDO>', inject([TempService, MockBackend],
      (service: TempService, backend: MockBackend) => {

        const mockResponse = [
          {raspberryid: '1', sensorid: '1', tempvalue: 25, tempdate: 2123123},
          {raspberryid: '1', sensorid: '1', tempvalue: 26, tempdate: 2123124},
          {raspberryid: '1', sensorid: '1', tempvalue: 27, tempdate: 2123126}
        ];

        prepareResponse(backend, mockResponse);

        service.getTempsInInterval(2000000, 2200000).subscribe((temps) => {
          expect(temps[0].tempvalue).toEqual(25);
          expect(temps[1].tempvalue).toEqual(26);
          expect(temps[2].tempvalue).toEqual(27);
          expect(temps.length).toEqual(3);
        });
      }));
  });

  describe('setReadInterval()', () => {

    it('should return True if successful', inject([TempService, MockBackend],
      (service: TempService, backend: MockBackend) => {

        const mockResponse = new SensorDO(3);

        prepareResponse(backend, mockResponse);

        service.setReadInterval(3).subscribe((response) => {
          expect(response.sensorSetValue).toEqual(3);
        });
      }));
  });

  describe('setHeaterTemp()', () => {

    it('should return the newly set heater temp value as Observable<SensorDO>', inject([TempService, MockBackend],
      (service: TempService, backend: MockBackend) => {

        const TEMP: number = 30;
        const mockResponse = new SensorDO(TEMP);

        prepareResponse(backend, mockResponse);

        service.setHeaterTemp(TEMP).subscribe((response) => {
          expect(response.sensorSetValue).toEqual(TEMP);
        });
      }));
  });

  describe('getHeaterTemp()', () => {

    it('should return the heater temp value as Observable<SensorDO>', inject([TempService, MockBackend],
      (service: TempService, backend: MockBackend) => {

        const TEMP: number = 30;
        const mockResponse = new SensorDO(TEMP);

        prepareResponse(backend, mockResponse);

        service.getHeaterTemp().subscribe((response) => {
          expect(response.sensorSetValue).toEqual(TEMP);
        });
      }));
  });

  describe('getOldestReadDates()', () => {

    it('should return the date of the oldest temp and ph read', inject([TempService, MockBackend],
      (service: TempService, backend: MockBackend) => {

        const mockResponse = {temp: 30, ph: 7};

        prepareResponse(backend, mockResponse);

        service.getOldestReadDates().subscribe((response) => {
          expect(response.temp).toEqual(30);
          expect(response.ph).toEqual(7);
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



