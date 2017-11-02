import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.css']
})
export class JobDialogComponent implements OnInit {

  public jobEndDate: Date;
  public jobDescription = '';
  public minJobEndDate: Date = new Date();

  constructor(public dialogRef: MatDialogRef<JobDialogComponent>) {
  }

  ngOnInit() {
    this.jobEndDate = new Date();
    this.jobEndDate.setDate((new Date()).getDate() + 1);
  }

}
