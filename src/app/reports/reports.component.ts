import {Component, OnInit, ViewChild} from "@angular/core";
import {UIChart} from "primeng/components/chart/chart";
import {TempService} from "../temp/temp.service";
import {PhService} from "../ph/ph.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})


export class ReportsComponent implements OnInit {

  @ViewChild('tempchart') tempChart: UIChart;
  @ViewChild('phchart') phChart: UIChart;

  tempStartDate: Date;
  tempEndDate: Date;
  phStartDate: Date;
  phEndDate: Date;

  tempData: any;
  phData: any;

  constructor(private tempService: TempService,
              private phService: PhService) {
    this.tempData = {
      datasets: [
        {
          label: 'Measured temperatures',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4bc0c0'
        }]
    };

    this.phData = {
      datasets: [
        {
          label: 'Measured ph values',
          data: ["65", "59", "80", "81", "56", "55", "40"],
          fill: false,
          borderColor: '#4bc0c0'
        }]
    };
  }


  loadTempInInterval(tempChart: UIChart) {
    let me = this;
    let newData: number[] = [];
    let newLabels: Date[] = [];
    this.tempService.getTempsInInterval("1490181834763", "1490206838763")
      .subscribe(tempDOs => {
          tempDOs.forEach(function (item) {
            newData.push(item.tempvalue);
            newLabels.push(item.tempdate);
          });
          me.tempData.datasets[0].data = newData;
          me.tempData.labels = newLabels;
          me.tempChart.refresh();
        },
        error => {
          console.log(error);
        });
  };

  loadPhsInInterval(phChart: UIChart) {
    let me = this;
    let newData: number[] = [];
    let newLabels: Date[] = [];
    this.phService.getPhsInInterval("1490181834763", "1490206838763")
      .subscribe(phDOs => {
          phDOs.forEach(function (item) {
            newData.push(item.phvalue);
            newLabels.push(item.phdate);
          });
          me.phData.datasets[0].data = newData;
          me.phData.labels = newLabels;
          me.phChart.refresh();
        },
        error => {
          console.log(error);
        });
  }


  ngOnInit() {

  }

}
