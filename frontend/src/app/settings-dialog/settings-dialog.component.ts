import {Component, OnInit} from "@angular/core";
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {

  public interval: number;
  public value: number;

  constructor(public dialogRef: MdDialogRef<SettingsDialogComponent>) {

  }

  ngOnInit() {
  }

}
