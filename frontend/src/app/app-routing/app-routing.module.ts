import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ExperimentComponent} from '../experiment/experiment.component';
import {LoginComponent} from '../login/login.component';
import {ReportsComponent} from '../reports/reports.component';
import {AuthGuardService} from '../services/auth-guard/auth-guard.service';
import {FeedbackComponent} from '../feedback/feedback.component';


const routes: Routes = [
  {path: '', redirectTo: '/experiment', pathMatch: 'full'},
  {path: 'experiment', component: ExperimentComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuardService]},
  {path: 'reports', component: ReportsComponent, canActivate: [AuthGuardService]},
  {path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuardService]},
  {path: '**', component: ExperimentComponent},
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
