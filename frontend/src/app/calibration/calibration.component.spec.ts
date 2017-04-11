import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CalibrationComponent} from "./calibration.component";
import {MaterialModule} from "@angular/material";
import {CalibrationService} from "../services/calibration/calibration.service";
import {PhService} from "../services/ph/ph.service";

describe('CalibrationComponent', () => {
  let component: CalibrationComponent;
  let fixture: ComponentFixture<CalibrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalibrationComponent],
      imports: [MaterialModule.forRoot()],
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
