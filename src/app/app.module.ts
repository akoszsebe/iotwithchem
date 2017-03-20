import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app/app.component';

import {TempService} from './temp/temp.service';

import {JustgageModule} from 'angular2-justgage';

import {MaterialModule, MdIconRegistry} from '@angular/material';
import {SidenavComponent} from './sidenav/sidenav.component';
import {LoginComponent} from './login/login.component';

import {AppRoutingModule} from './app-routing/app-routing.module';
import {ReportsComponent} from './reports/reports.component'
import {AuthService} from "./auth/auth.service";
import {AuthGuardService} from "./auth-guard/auth-guard.service";
import {SettingsDialogComponent} from './settings-dialog/settings-dialog.component';
import {DialogService} from "./dialog/dialog.service";

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
    AppRoutingModule
  ],
  providers: [
    TempService,
    MdIconRegistry,
    AuthService,
    AuthGuardService,
    DialogService
  ],
  bootstrap: [SidenavComponent]
})
export class AppModule {
}
