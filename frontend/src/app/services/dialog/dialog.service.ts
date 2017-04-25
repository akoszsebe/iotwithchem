import {Injectable} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {SettingsDialogComponent} from '../../dialogs/settings-dialog/settings-dialog.component';
import {JobDialogComponent} from '../../dialogs/job-dialog/job-dialog.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';


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
    dialogRef = this.dialog.open(JobDialogComponent, {width: '350px', disableClose: true});

    return dialogRef.afterClosed();
  }

  public openConfirmation(message: String): Observable<boolean> {
    let dialogRef: MdDialogRef<ConfirmDialogComponent>;
    dialogRef = this.dialog.open(ConfirmDialogComponent, {disableClose: true});
    dialogRef.componentInstance.message = message;
    return dialogRef.afterClosed();
  }


}
