import {Injectable} from "@angular/core";
import {MdDialog, MdDialogRef} from "@angular/material";
import {SettingsDialogComponent} from "../settings-dialog/settings-dialog.component";
import {Observable} from "rxjs";
import {JobDialogComponent} from "../job-dialog/job-dialog.component";

@Injectable()
export class DialogService {

  constructor(private dialog: MdDialog) {
  }

  public openSettings(interval: number, value: number): Observable<number[]> {
    let dialogRef: MdDialogRef<SettingsDialogComponent>;
    dialogRef = this.dialog.open(SettingsDialogComponent);
    dialogRef.componentInstance.interval = interval;
    dialogRef.componentInstance.value = value;

    return dialogRef.afterClosed();

  }


  public openNewJob(): Observable<[Date, string]> {
    let dialogRef: MdDialogRef<JobDialogComponent>;
    dialogRef = this.dialog.open(JobDialogComponent, {height: "500px", width: "400px", disableClose: true});

    return dialogRef.afterClosed();

  }
}
