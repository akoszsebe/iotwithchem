import {NgModule} from "@angular/core";
import {SidenavComponent} from "./sidenav/sidenav.component";
import {LoginComponent} from "./login/login.component";
import {ReportsComponent} from "./reports/reports.component";
import {SettingsDialogComponent} from "./settings-dialog/settings-dialog.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {JustgageModule} from "angular2-justgage";
import {MaterialModule, MdIconRegistry} from "@angular/material";
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {CalendarModule, ProgressBarModule} from "primeng/primeng";
import {TempService} from "./temp/temp.service";
import {AuthService} from "./auth/auth.service";
import {AuthGuardService} from "./auth-guard/auth-guard.service";
import {DialogService} from "./dialog/dialog.service";
import {ChartModule} from "primeng/components/chart/chart";
import {PhService} from "./ph/ph.service";
import {ResearchComponent} from "./research/research.component";
import {JobService} from "./job/job.service";
import {JobDialogComponent} from "./job-dialog/job-dialog.component";
import {CountDown} from "../../../node_modules/angular2-simple-countdown/countdown";
import { FeedbackComponent } from './feedback/feedback.component';
import {FeedbackService} from "./feedback/feedback.service";


@NgModule({
  declarations: [
    ResearchComponent,
    SidenavComponent,
    LoginComponent,
    ReportsComponent,
    FeedbackComponent,
    SettingsDialogComponent,
    JobDialogComponent,
    CountDown,
    FeedbackComponent
  ],
  entryComponents: [
    SettingsDialogComponent,
    JobDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JustgageModule,
    MaterialModule,
    AppRoutingModule,
    CalendarModule,
    ChartModule,
    ProgressBarModule
  ],
  providers: [
    TempService,
    PhService,
    MdIconRegistry,
    AuthService,
    AuthGuardService,
    DialogService,
    JobService,
    FeedbackService
  ],
  bootstrap: [SidenavComponent]
})
export class AppModule {
}
