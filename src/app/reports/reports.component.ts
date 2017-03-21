import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})


export class ReportsComponent implements OnInit {




  constructor() {
    this.options1 = {
      title: {text: 'Temperature chart'},
      series: [{
        data: [29.9, 71.5, 106.4, 129.2],
      }]
    };

    this.options2 = {
      title: {text: 'ph chart'},
      series: [{
        data: [6,5,3,4,5,6,7,6,5,4,3,2,1],
      }]
    };
  }
  options1: Object;
  options2: Object;

  ngOnInit() {

  }

}
