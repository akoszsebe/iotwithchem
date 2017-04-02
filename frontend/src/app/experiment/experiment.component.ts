import {Component, OnDestroy, OnInit} from '@angular/core';
import {TempService} from '../services/temp/temp.service';
import {DialogService} from '../services/dialog/dialog.service';
import {PhService} from '../services/ph/ph.service';
import {JobService} from '../services/job/job.service';
import {JobDO} from '../model/job';
import {TemperatureDO} from '../model/temperature';
import {PhDO} from '../model/ph';
import {JobDateDO} from '../model/job-date';
import {AuthService} from '../services/auth/auth.service';
import {UserDO} from '../model/user';


@Component({
  selector: 'app-root',
  templateUrl: 'experiment.component.html',
  styleUrls: ['experiment.component.css']
})
export class ExperimentComponent implements OnInit, OnDestroy {

  progressBarTimer: any;
  countdownDate: Date;
  optionsTempGauge = {
    id: 'tempGauge',
    label: 'Temp',
    symbol: '°C',
    min: 0,
    max: 100,
    decimals: 3,
    gaugeWidthScale: 0.6,
    customSectors: [],
    counter: true
  };
  optionsPHGauge = {
    id: 'phGauge',
    label: 'pH',
    min: 1,
    max: 14,
    decimals: 3,
    gaugeWidthScale: 0.6,
    customSectors: [],
    counter: true
  };


  maxTemp = 100;
  tempReadInt = 3;
  tempSetValue: number;

  maxPH = 14;
  phReadInt = 3;
  phSetValue = 1;

  currentJob = new JobDateDO(new Date(), new Date(), '');

  syncLabel = 'Sync is on';
  toggleChecked: boolean;


  tempTimer: any;
  phTimer: any;

  temp = new TemperatureDO('', '', 0, 0);
  ph = new PhDO('', '', 1, 0);

  progressBarValue: number;

  text: any = {
    'Weeks': 'w',
    'Days': 'd', 'Hours': 'h',
    'Minutes': 'm', 'Seconds': 's',
    'MilliSeconds': 'ms'
  };

  static setupJob(job: JobDO, currentJob: JobDateDO) {
    const date1 = new Date();
    date1.setTime(job.jobStartDate);
    currentJob.jobStartDate = date1;
    const date2 = new Date();
    date2.setTime(job.jobEndDate);
    currentJob.jobEndDate = date2;
    currentJob.jobDescription = job.jobDescription;
  }

  constructor(private tempService: TempService,
              private phService: PhService,
              private jobService: JobService,
              private dialogService: DialogService,
              private authService: AuthService) {
  }

  checkAuth(): void {
   // this.authService.setUser(new UserDO('asdasd', 'asdas', 'asd12', 'skff9923'));
    console.log(this.authService.getUser());
  }

  ngOnDestroy(): void {
    clearInterval(this.tempTimer);
    clearInterval(this.phTimer);
    clearInterval(this.progressBarTimer);
  }


  ngOnInit(): void {
    this.toggleChecked = true;
    this.startSync();
    this.tempService.getHeaterTemp()
      .subscribe(temp => {
        this.tempSetValue = temp.heatertemperature;
        console.log(temp.heatertemperature);
      });
    this.jobService.getJob()
      .subscribe(job => {
        ExperimentComponent.setupJob(job, this.currentJob);
        if (this.currentJob.jobEndDate < (new Date())) {
          this.countdownDate = null;
        } else {
          this.countdownDate = this.currentJob.jobEndDate;
        }
        this.calculateProgBarValue();
        this.progressBarTimer = setInterval(() => {
          this.calculateProgBarValue();
          console.log('progressbar updated');
        }, 30000);
      });

  }


  toggleSync() {
    console.log(this.toggleChecked);
    if (this.toggleChecked) {
      this.syncLabel = 'Sync is on';
    } else {
      this.syncLabel = 'Sync is off';
    }
  }

  startSync() {
    this.getTemp();
    this.getPh();
  }


  getTemp() {
    this.tempTimer = setInterval(() => {
      if (!this.toggleChecked) {
        return;
      }
      this.tempService.getTemp()
        .subscribe(temp => {
            this.temp = temp;
            console.log(temp);
          },
          error => {
            console.log(error);
          });
    }, this.tempReadInt * 1000);
  }

  getPh() {
    this.phTimer = setInterval(() => {
      if (!this.toggleChecked) {
        return;
      }
      this.phService.getPh()
        .subscribe(ph => {
            this.ph = ph;
            console.log(ph);
          },
          error => {
            console.log(error);
          });
    }, this.phReadInt * 1000);
  }


  openTempSettings() {

    this.dialogService.openSettings(this.tempReadInt, this.tempSetValue).subscribe(res => {
      if (res != null) {

        this.tempReadInt = res[0];

        this.optionsTempGauge = {
          id: 'tempGauge',
          label: 'Temp',
          symbol: '°C',
          min: 0,
          max: 100,
          decimals: 3,
          gaugeWidthScale: 0.6,
          customSectors: [{
            color: '#ff0000', lo: 0, hi: this.tempSetValue - 3
          }, {
            color: '#ffd50e', lo: this.tempSetValue - 3, hi: this.tempSetValue - 1
          }, {
            color: '#00ff00', lo: this.tempSetValue - 1, hi: this.tempSetValue + 1
          }, {
            color: '#ffd50e', lo: this.tempSetValue + 1, hi: this.tempSetValue + 3
          }, {
            color: '#ff0000', lo: this.tempSetValue + 3, hi: 100
          }],
          counter: true
        };
        this.tempService.setReadInterval(res[0] * 1000)
          .subscribe(result => {
            console.log(result);
          });
        this.tempService.setHeaterTemp(res[1])
          .subscribe(result => {
            this.tempSetValue = result.heatertemperature;
            console.log(res);
          });
      }
    });
  }

  openPhSettings() {
    this.dialogService.openSettings(this.phReadInt, this.phSetValue).subscribe(res => {

      if (res != null) {
        this.phReadInt = res[0];
        this.phSetValue = res[1];

        this.phService.setPhValue(res[1])
          .subscribe(result => {
            console.log(result.sent);
          });

        this.optionsPHGauge = {
          id: 'phGauge',
          label: 'pH',
          min: 1,
          max: 14,
          decimals: 3,
          gaugeWidthScale: 0.6,
          customSectors: [{
            color: '#ff0000', lo: 1, hi: this.phSetValue - 2
          }, {
            color: '#ffd50e', lo: this.phSetValue - 2, hi: this.phSetValue - 0.5
          }, {
            color: '#00ff00', lo: this.phSetValue - 0.5, hi: this.phSetValue + 0.5
          }, {
            color: '#ffd50e', lo: this.phSetValue + 0.5, hi: this.phSetValue + 2
          }, {
            color: '#ff1105', lo: this.phSetValue + 2, hi: 14
          }],
          counter: true
        };
        console.log(res);
      }
    });
  }


  checkJob() {
    if ((new Date()) < this.currentJob.jobEndDate) {
      this.dialogService.openConfirmation().subscribe(response => {
        if (response) {
          this.openNewJob();
        }
      });
    } else {
      this.openNewJob();
    }
  }

  openNewJob() {
    this.dialogService.openNewJob()
      .subscribe(res => {
        console.log(res);
        if ((res[0]) != null) {
          this.jobService.setJob(new JobDO(new Date().getTime(), res[0].getTime(), res[1]))
            .subscribe(newJob => {
              ExperimentComponent.setupJob(newJob, this.currentJob);
              this.countdownDate = new Date();
              this.countdownDate = this.currentJob.jobEndDate;
              this.calculateProgBarValue();
            });
        }
      });
  }


  calculateProgBarValue() {

    if (this.currentJob.jobEndDate > (new Date())) {
      this.progressBarValue = parseFloat((((new Date().getTime()) - this.currentJob.jobStartDate.getTime() ) * 100
      / (this.currentJob.jobEndDate.getTime() - this.currentJob.jobStartDate.getTime())).toFixed(3));
    } else {
      this.progressBarValue = 100;
    }
  }

  displayDate(date: Date): string {
    return date.getFullYear() + '/' + (date.getMonth().valueOf() + 1) + '/' + date.getDate() +
      '  -  ' +
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }


}
