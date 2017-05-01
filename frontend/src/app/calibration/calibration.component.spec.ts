import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalibrationComponent} from './calibration.component';
import {CalibrationService} from '../services/calibration/calibration.service';
import {StepsModule} from 'primeng/primeng';
import {RouterTestingModule} from '@angular/router/testing';
import {CustomMdModule} from '../../custom-md/custom-md.module';
import {PhService} from '../services/ph/ph.service';

describe('CalibrationComponent', () => {
  let component: CalibrationComponent;
  let fixture: ComponentFixture<CalibrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalibrationComponent],
      imports: [CustomMdModule, StepsModule, RouterTestingModule],
      providers: [CalibrationService, PhService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
