import {NgModule} from "@angular/core";
import {AppComponent} from "./app/app.component";
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
import {CalendarModule} from "primeng/primeng";
import {TempService} from "./temp/temp.service";
import {AuthService} from "./auth/auth.service";
import {AuthGuardService} from "./auth-guard/auth-guard.service";
import {DialogService} from "./dialog/dialog.service";
import {ChartModule} from "primeng/components/chart/chart";
import {PhService} from "./ph/ph.service";


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    LoginComponent,
    ReportsComponent,
    SettingsDialogComponent
  ],
  entryComponents: [
    SettingsDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JustgageModule,
    MaterialModule,
    AppRoutingModule,
    CalendarModule,
    ChartModule
  ],
  providers: [
    TempService,
    PhService,
    MdIconRegistry,
    AuthService,
    AuthGuardService,
    DialogService
  ],
  bootstrap: [SidenavComponent]
})
export class AppModule {
}
