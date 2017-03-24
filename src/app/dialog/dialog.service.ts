import {Injectable} from "@angular/core";
import {MdDialog, MdDialogRef} from "@angular/material";
import {SettingsDialogComponent} from "../settings-dialog/settings-dialog.component";
import {Observable} from "rxjs";

@Injectable()
export class DialogService {

  constructor(private dialog: MdDialog) {
  }

  public openSettings(interval: number, value: number): Observable<number[]> {
    let dialogRef: MdDialogRef<SettingsDialogComponent>;
    dialogRef = this.dialog.open(SettingsDialogComponent);
    dialogRef.componentInstance.interval = interval;
    dialogRef.componentInstance.value = value;
    dialogRef.componentInstance.previousInterval = interval;
    dialogRef.componentInstance.previousValue = value;

    return dialogRef.afterClosed();


  }
}
