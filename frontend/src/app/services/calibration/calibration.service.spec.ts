import { TestBed, inject } from '@angular/core/testing';

import { CalibrationService } from './calibration.service';
import {MaterialModule} from "@angular/material";

describe('CalibrationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalibrationService],
      imports: [MaterialModule.forRoot()]
    });
  });

  it('should ...', inject([CalibrationService], (service: CalibrationService) => {
    expect(service).toBeTruthy();
  }));
});
