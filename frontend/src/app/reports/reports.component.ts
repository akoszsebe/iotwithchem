import {Component, OnInit, ViewChild} from '@angular/core';
import {UIChart} from 'primeng/components/chart/chart';
import {TempService} from '../services/temp/temp.service';
import {PhService} from '../services/ph/ph.service';

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


  tempChartData: any;
  phChartData: any;


  constructor(private tempService: TempService,
              private phService: PhService) {
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
          tempDOs.forEach(function (item) {
            newData.push(item.tempvalue);
            const date = new Date();
            date.setTime(item.tempdate);
            newLabels.push(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
          });
          me.tempChartData.datasets[0].data = newData;
          me.tempChartData.labels = newLabels;
          me.tempChart.refresh();
        },
        error => {
          console.log(error);
        });
  };

  loadPhsInInterval(phChart: UIChart) {
    if (this.phStartDate == null || this.phEndDate == null) {
      return;
    }
    const me = this;
    const newData: number[] = [];
    const newLabels: string[] = [];
    this.phService.getPhsInInterval(this.phStartDate.getTime(), this.phEndDate.getTime())
      .subscribe(phDOs => {
          phDOs.forEach(function (item) {
            newData.push(item.phvalue);
            const date = new Date();
            date.setTime(item.phdate);
            newLabels.push(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
          });
          me.phChartData.datasets[0].data = newData;
          me.phChartData.labels = newLabels;
          me.phChart.refresh();
        },
        error => {
          console.log(error);
        });
  }


  ngOnInit() {
    this.tempService.getOldestReadDates().subscribe(dates => {
      this.tempMinDate = new Date();
      this.tempMinDate.setTime(dates.temp);
      this.tempMaxDate = new Date();
      this.phMinDate = new Date();
      this.phMinDate.setTime(dates.ph);
      this.phMaxDate = new Date();
    });
  }

}
