import {Component, OnInit, ViewChild} from '@angular/core';
import {UIChart} from 'primeng/components/chart/chart';
import {TempService} from '../../services/temp/temp.service';
import {PhService} from '../../services/ph/ph.service';
import {MatSnackBar} from '@angular/material';
import { DevicesDO } from 'app/models/devices';
import {DevicesService} from '../../services/devices/devices.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})


export class ReportsComponent implements OnInit {

  @ViewChild('tempchart') tempChart: UIChart;
  @ViewChild('phchart') phChart: UIChart;

  tempMinDate: Date;
  tempMaxDate: Date;
  tempStartDate: Date;
  tempEndDate: Date;

  phMinDate: Date;
  phMaxDate: Date;
  phStartDate: Date;
  phEndDate: Date;

  selected: string;
  devices:DevicesDO;
  tempChartData: any;
  phChartData: any;


  constructor(private tempService: TempService,
              private phService: PhService,
              private snackBar: MatSnackBar,
              private devicesService: DevicesService,) {
    this.tempChartData = {
      datasets: [
        {
          label: 'Measured temperatures',
          fill: true,
          borderColor: '#4bc0c0'
        }]
    };

    this.phChartData = {
      datasets: [
        {
          label: 'Measured ph values',
          fill: true,
          borderColor: '#4bc0c0'
        }]
    };
  }


  loadTempInInterval(tempChart: UIChart) {
    if (this.tempStartDate == null || this.tempEndDate == null) {
      return;
    }
    const me = this;
    const newData: number[] = [];
    const newLabels: string[] = [];
    this.tempService.getTempsInInterval(this.tempStartDate.getTime(), this.tempEndDate.getTime())
      .subscribe(tempDOs => {
          if (tempDOs.length === 0) {
            this.snackBar.open('No records in that period', null, {duration: 2000});
          } else {
            tempDOs.forEach(function (item) {
              newData.push(item.tempvalue);
              const date = new Date();
              date.setTime(item.tempdate);
              newLabels.push(date.toLocaleString());
            });
            me.tempChartData.datasets[0].data = newData;
            me.tempChartData.labels = newLabels;
            me.tempChart.refresh();
          }
        },
        error => {
          console.log(error);
        });
  };

  exportTempsInInterval() {
    this.tempService.exportTempsInInterval(this.tempStartDate.getTime(), this.tempEndDate.getTime());
  }

  exportPhsInInterval() {
    this.phService.exportPhsInInterval(this.phStartDate.getTime(), this.phEndDate.getTime());
  }

  loadPhsInInterval(phChart: UIChart) {
    if (this.phStartDate == null || this.phEndDate == null) {
      return;
    }
    const me = this;
    const newData: number[] = [];
    const newLabels: string[] = [];
    this.phService.getPhsInInterval(this.phStartDate.getTime(), this.phEndDate.getTime())
      .subscribe(phDOs => {
          if (phDOs.length === 0) {
            this.snackBar.open('No records in that period', null, {duration: 2000});
          } else {
            phDOs.forEach(function (item) {
              newData.push(item.phvalue);
              const date = new Date();
              date.setTime(item.phdate);
              newLabels.push(date.toLocaleString());
            });
            me.phChartData.datasets[0].data = newData;
            me.phChartData.labels = newLabels;
            me.phChart.refresh();
          }
        },
        error => {
          console.log(error);
        });
  }

  selectChanged() {
    console.log(this.selected);
  }

  ngOnInit() {
    this.devicesService.getDevices().subscribe(tmpdevices => {
      console.log("-----devices -- " + tmpdevices);
      this.devices = tmpdevices;
      this.selected = this.devices[0].deviceid;
      this.tempService.getOldestReadDates('-1').subscribe(dates => { 
        this.tempMinDate = new Date();
        this.tempMinDate.setTime(dates.temp);
        this.tempMaxDate = new Date();
        this.phMinDate = new Date();
        this.phMinDate.setTime(dates.ph);
        this.phMaxDate = new Date();
      });
    },
    error => {
      console.log(error);
      this.tempService.getOldestReadDates('-1').subscribe(dates => { 
        this.tempMinDate = new Date();
        this.tempMinDate.setTime(dates.temp);
        this.tempMaxDate = new Date();
        this.phMinDate = new Date();
        this.phMinDate.setTime(dates.ph);
        this.phMaxDate = new Date();
      });
    });
    
    

    this.tempEndDate = new Date();
    this.tempStartDate = new Date();
    this.tempStartDate.setDate((new Date()).getDate() - 1);
    this.phEndDate = new Date();
    this.phStartDate = new Date();
    this.phStartDate.setDate((new Date()).getDate() - 1);
  }

}
