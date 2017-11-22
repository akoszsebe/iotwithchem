import {SidenavComponent} from './components/sidenav/sidenav.component';
import {LoginComponent} from './components/login/login.component';
import {ReportsComponent} from './components/reports/reports.component';
import {SettingsDialogComponent} from './components/dialogs/settings-dialog/settings-dialog.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {JustgageModule} from 'angular2-justgage';
import {AppRoutingModule} from '../app-routing/app-routing.module';
import {CalendarModule, MessagesModule, ProgressBarModule, StepsModule} from 'primeng/primeng';
import {TempService} from './services/temp/temp.service';
import {AuthService} from './services/auth/auth.service';
import {AuthGuardService} from './services/auth-guard/auth-guard.service';
import {DialogService} from './services/dialog/dialog.service';
import {ChartModule} from 'primeng/components/chart/chart';
import {PhService} from './services/ph/ph.service';
import {ExperimentComponent} from './components/experiment/experiment.component';
import {JobService} from './services/job/job.service';
import {DevicesService} from './services/devices/devices.service';
import {JobDialogComponent} from './components/dialogs/job-dialog/job-dialog.component';
import {CountDown} from 'angular2-simple-countdown/lib/countdown';
import {FeedbackComponent} from './components/feedback/feedback.component';
import {FeedbackService} from './services/feedback/feedback.service';
import {ConfirmDialogComponent} from './components/dialogs/confirm-dialog/confirm-dialog.component';
import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CalibrationComponent} from './components/calibration/calibration.component';
import {CalibrationService} from './services/calibration/calibration.service';
import {DeviceService} from './services/device/device.service';
import {CustomMatModule} from '../custom-md/custom-md.module';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    ExperimentComponent,
    SidenavComponent,
    LoginComponent,
    ReportsComponent,
    FeedbackComponent,
    SettingsDialogComponent,
    JobDialogComponent,
    CountDown,
    FeedbackComponent,
    ConfirmDialogComponent,
    CalibrationComponent
  ],
  entryComponents: [
    SettingsDialogComponent,
    JobDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    JustgageModule,
    CustomMatModule,
    AppRoutingModule,
    CalendarModule,
    ChartModule,
    ProgressBarModule,
    MessagesModule,
    StepsModule,
    MatSelectModule
  ],
  providers: [
    TempService,
    PhService,
    AuthService,
    AuthGuardService,
    DialogService,
    JobService,
    FeedbackService,
    CalibrationService,
    DeviceService,
    DevicesService,
    {provide: LOCALE_ID, useValue: 'ro-RO'}
  ],
  bootstrap: [SidenavComponent]
})
export class AppModule {
}
