import {async, TestBed} from "@angular/core/testing";
import {SettingsDialogComponent} from "./settings-dialog.component";
import {MaterialModule, MdDialog} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [SettingsDialogComponent],
  imports:[FormsModule, MaterialModule.forRoot(), BrowserAnimationsModule],
  entryComponents: [SettingsDialogComponent],
  exports: [SettingsDialogComponent],
})

class TestModule {
}

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let dialog: MdDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
  }));

  beforeEach(() => {
    dialog = TestBed.get(MdDialog);
    let dialogRef = dialog.open(SettingsDialogComponent);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
