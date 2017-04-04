import {Component, OnInit} from '@angular/core';
import {CalibrationService} from '../services/calibration/calibration.service';
import {PhService} from '../services/ph/ph.service';

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.css']
})
export class CalibrationComponent implements OnInit {

  color = '#FFFFFF';
  mode = 'indeterminate';
  currentLevel = 0;
  levels = ['Low', 'Mid', 'High', 'again'];
  buttonDisabled = false;

  constructor(private calibrationService: CalibrationService,
              private phService: PhService) {
  }

  ngOnInit() {
  }

  calibrate() {
    if (this.currentLevel < 3) {
      this.buttonDisabled = true;
      this.calibrationService.calibratePhSensor(this.levels[this.currentLevel]).subscribe(response => {
        console.log(response);
      });
      setTimeout(() => {
        this.buttonDisabled = false;
        this.currentLevel = (this.currentLevel + 1) % 4;
      }, 3000);
    } else {
      this.currentLevel = (this.currentLevel + 1) % 4;
    }
  }

}
