import {Component, OnInit} from '@angular/core';
import {Temperature} from '../model/temperature';
import {TempService} from '../temp/temp.service';
import {MdDialog, MdDialogConfig, MdDialogRef} from "@angular/material";
import {SettingsDialogComponent} from "../settings-dialog/settings-dialog.component";
import {DialogService} from "../dialog/dialog.service";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {

  optionsTempGauge = {
    id: "tempGauge",
    label: "Temp",
    symbol: "°C",
    min: 0,
    max: 100,
    decimals: 2,
    gaugeWidthScale: 0.6,
    customSectors: [],
    counter: true
  };

  optionsPHGauge = {
    id: "phGauge",
    label: "pH",
    min: 1,
    max: 14,
    decimals: 2,
    gaugeWidthScale: 0.6,
    customSectors: [],
    counter: true
  };


  optionsTimerGauge = {
    id: "timerGauge",
    label: "Timer",
    symbol: "s",
    min: 0,
    max: 60,
    decimals: 2,
    gaugeWidthScale: 0.4,
    levelColors: ["#000000"],
    counter: true,
    donut: true
  };


  maxTemp = 100;
  tempReadInt = 0;
  tempReadValue = 0;
  tempSetValue = 0;

  maxPH = 14;
  phReadInt = 0;
  phSetValue = 1;
  phReadValue = 1;

  maxTime = 60;
  valueTimer = 60;


  loadTemperatures() {
    let diff1 = -10, diff2 = -1;
    setInterval(() => {
      if (this.tempReadValue === 100 || this.tempReadValue === 0) {
        diff1 = diff1 * -1;
      }
      if (this.phReadValue === 14 || this.phReadValue === 1) {
        diff2 = diff2 * -1;
      }
      if (this.valueTimer > 0) {
        this.valueTimer--;
      }

      this.tempReadValue = this.tempReadValue + diff1;
      this.phReadValue = this.phReadValue + diff2;

    }, 1000);
  }

  getTemp() {
    this.tempService.getTemp()
      .subscribe(temp => {
          this.temp = temp;
          console.log(temp.tempvalue);
        },
        error => {
          console.log(error)
        });
  }

  temp = new Temperature("", "", "", "");

  constructor(private tempService: TempService,
              private dialogService: DialogService) {
  }


  openTempSettings() {

    this.dialogService.openSettings(this.tempReadInt, this.tempSetValue).subscribe(res => {
      this.tempReadInt = res[0];
      this.tempSetValue = res[1];

      this.optionsTempGauge = {
        id: "tempGauge",
        label: "Temp",
        symbol: "°C",
        min: 0,
        max: 100,
        decimals: 2,
        gaugeWidthScale: 0.6,
        customSectors: [{
          color: "#ff0000", lo: 0, hi: this.tempSetValue - 3
        }, {
          color: "#ffd50e", lo: this.tempSetValue - 3, hi: this.tempSetValue - 1
        }, {
          color: "#00ff00", lo: this.tempSetValue - 1, hi: this.tempSetValue + 1
        }, {
          color: "#ffd50e", lo: this.tempSetValue + 1, hi: this.tempSetValue + 3
        }, {
          color: "#ff0000", lo: this.tempSetValue + 3, hi: 100
        }],
        counter: true
      };

      console.log(res)
    });
  }

  openPhSettings() {
    this.dialogService.openSettings(this.phReadInt, this.phSetValue).subscribe(res => {
      this.phReadInt = res[0];
      this.phSetValue = res[1];

      this.optionsPHGauge = {
        id: "phGauge",
        label: "pH",
        min: 1,
        max: 14,
        decimals: 2,
        gaugeWidthScale: 0.6,
        customSectors: [{
          color: "#ff0000", lo: 1, hi: this.phSetValue - 2
        }, {
          color: "#ffd50e", lo: this.phSetValue - 2, hi: this.phSetValue - 0.5
        }, {
          color: "#00ff00", lo: this.phSetValue - 0.5, hi: this.phSetValue + 0.5
        }, {
          color: "#ffd50e", lo: this.phSetValue + 0.5, hi: this.phSetValue + 2
        }, {
          color: "#ff1105", lo: this.phSetValue + 2, hi: 14
        }],
        counter: true
      };

      console.log(res)
    });
  }
}
