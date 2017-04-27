import {async, TestBed} from '@angular/core/testing';
import {ExperimentComponent} from './experiment.component';
import {MaterialModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {MessagesModule, ProgressBarModule} from 'primeng/primeng';
import {CountDown} from 'angular2-simple-countdown/lib/countdown';
import {JustgageModule} from 'angular2-justgage';
import {TempService} from '../services/temp/temp.service';
import {PhService} from '../services/ph/ph.service';
import {JobService} from '../services/job/job.service';
import {DialogService} from '../services/dialog/dialog.service';
import {AuthService} from '../services/auth/auth.service';
import {DeviceService} from '../services/device/device.service';


describe('ExperimentComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExperimentComponent, CountDown
      ],
      imports: [MaterialModule.forRoot(), FormsModule, ProgressBarModule, JustgageModule, MessagesModule],
      providers: [TempService, PhService, JobService, DialogService, AuthService, DeviceService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(ExperimentComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  /* it(`should have as title 'app works!'`, async(() => {
   const fixture = TestBed.createComponent(ExperimentComponent);
   const app = fixture.debugElement.componentInstance;
   expect(app.title).toEqual('app works!');
   }));

   it('should render title in a h1 tag', async(() => {
   const fixture = TestBed.createComponent(ExperimentComponent);
   fixture.detectChanges();
   const compiled = fixture.debugElement.nativeElement;
   expect(compiled.querySelector('h1').textContent).toContain('app works!');
   }));*/
});
