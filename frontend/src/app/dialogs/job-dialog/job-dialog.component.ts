import {Component, OnInit} from "@angular/core";
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.css']
})
export class JobDialogComponent implements OnInit {

  public jobEndDate: Date;
  public jobDescription: string = "";
  public minJobEndDate: Date = new Date();

  constructor(public dialogRef: MdDialogRef<JobDialogComponent>) {
  }

  ngOnInit() {
  }

}
