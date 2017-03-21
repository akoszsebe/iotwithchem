import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})


export class ReportsComponent implements OnInit {

  tempStartDate: Date;
  tempEndDate: Date;
  phStartDate: Date;
  phEndDate: Date;

  tempData: any;
  phData: any;

  constructor() {
    this.tempData = {
      datasets: [
        {
          label: 'Measured temperatures',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: true,
          borderColor: '#4bc0c0'
        }]
    };

    this.phData = {
      datasets: [
        {
          label: 'Measured ph values',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4bc0c0'
        }]
    };
  }

  ngOnInit() {

  }

}
