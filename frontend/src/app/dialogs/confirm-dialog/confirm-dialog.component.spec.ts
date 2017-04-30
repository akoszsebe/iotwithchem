import {async, TestBed} from '@angular/core/testing';

import {ConfirmDialogComponent} from './confirm-dialog.component';
import {MaterialModule, MdDialog} from '@angular/material';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [MaterialModule.forRoot(), BrowserAnimationsModule],
  entryComponents: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent],
})

class TestModule {
}

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let dialog: MdDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
  }));

  beforeEach(() => {
    dialog = TestBed.get(MdDialog);
    const dialogRef = dialog.open(ConfirmDialogComponent);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
