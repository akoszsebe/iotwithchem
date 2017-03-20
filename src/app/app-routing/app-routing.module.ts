import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from '../app/app.component';
import {LoginComponent} from '../login/login.component';
import {ReportsComponent} from '../reports/reports.component'
import {AuthGuardService} from "../auth-guard/auth-guard.service";


const routes: Routes = [
  {path: 'research', component: AppComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuardService]},
  {path: 'reports', component: ReportsComponent, canActivate: [AuthGuardService]},
  {path: '*', redirectTo: '/research'},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
