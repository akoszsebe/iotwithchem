import {Component, OnInit} from '@angular/core';
import {CalibrationService} from '../services/calibration/calibration.service';
import {PhService} from '../services/ph/ph.service';
import {MenuItem} from 'primeng/primeng';

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.css']
})
export class CalibrationComponent implements OnInit {

  colors = ['warn', 'accent', 'primary'];
  mode = 'indeterminate';
  currentLevel = 0;
  levels = ['Low', 'Mid', 'High', 'again'];
  buttonDisabled = false;

  items: MenuItem[];

  constructor(private calibrationService: CalibrationService,
              private phService: PhService) {
  }

  ngOnInit() {
    this.items = [{
      label: 'Low'
    },
      {
        label: 'Middle'
      },
      {
        label: 'High'
      },
      {
        label: 'Done'
      }
    ];
  }

  calibrate() {
    if (this.currentLevel < 3) {

      this.buttonDisabled = true;
      this.calibrationService.calibratePhSensor(this.levels[this.currentLevel]).subscribe(response => {
        console.log(response);
        setTimeout(() => {
          this.buttonDisabled = false;
          this.currentLevel = (this.currentLevel + 1) % 4;
        }, 5000);
      });
    } else {
      this.currentLevel = (this.currentLevel + 1) % 4;
    }
  }
}
