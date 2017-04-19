import {async, TestBed} from '@angular/core/testing';

import {JobDialogComponent} from './job-dialog.component';
import {MaterialModule, MdDialog} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CalendarModule} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [JobDialogComponent],
  imports: [FormsModule, MaterialModule.forRoot(), CalendarModule, BrowserAnimationsModule],
  entryComponents: [JobDialogComponent],
  exports: [JobDialogComponent],
})

class TestModule {
}


describe('JobDialogComponent', () => {
  let component: JobDialogComponent;
  let dialog: MdDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
  }));

  beforeEach(() => {
    dialog = TestBed.get(MdDialog);
    let dialogRef = dialog.open(JobDialogComponent);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
