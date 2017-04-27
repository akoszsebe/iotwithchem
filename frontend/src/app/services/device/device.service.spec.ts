import {inject, TestBed} from '@angular/core/testing';

import {DeviceService} from './device.service';
import {HttpModule} from '@angular/http';

describe('DeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceService],
      imports: [HttpModule]
    });
  });

  it('should ...', inject([DeviceService], (service: DeviceService) => {
    expect(service).toBeTruthy();
  }));
});
