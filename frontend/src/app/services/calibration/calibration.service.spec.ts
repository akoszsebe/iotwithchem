import { TestBed, inject } from '@angular/core/testing';

import { CalibrationServiceService } from './calibration.service';

describe('CalibrationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalibrationServiceService]
    });
  });

  it('should ...', inject([CalibrationServiceService], (service: CalibrationServiceService) => {
    expect(service).toBeTruthy();
  }));
});
