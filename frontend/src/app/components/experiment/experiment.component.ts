import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message} from 'primeng/primeng';
import {JobDateDO} from '../../models/job-date';
import {TemperatureDO} from '../../models/temperature';
import {PhDO} from '../../models/ph';
import {JobDO} from '../../models/job';
import {PhService} from '../../services/ph/ph.service';
import {TempService} from '../../services/temp/temp.service';
import {DevicesService} from '../../services/devices/devices.service';
import {JobService} from '../../services/job/job.service';
import {DialogService} from '../../services/dialog/dialog.service';
import {DeviceService} from '../../services/device/device.service';
import { DevicesDO } from 'app/models/devices';


@Component({
  selector: 'app-root',
  templateUrl: 'experiment.component.html',
  styleUrls: ['experiment.component.css']
})
export class ExperimentComponent implements OnInit, OnDestroy {

  progressBarTimer: any;
  countdownDate: Date;
  optionsTempGauge = ExperimentComponent.createTempGauge(50);
  optionsPHGauge = ExperimentComponent.createPhGauge(7);

  maxTemp = 100;
  maxPH = 14;

  currentJob = new JobDateDO(new Date(), new Date(), '', 0, 0, 0, 0);

  devices:DevicesDO;


  selected: string;
  syncLabel: string;
  toggleChecked: boolean;
  deviceConnected: boolean;


  tempTimer: any;
  phTimer: any;

  temp = new TemperatureDO('', '', 0, 0);
  ph = new PhDO('', '', 0, 0);

  progressBarValue: number;

  connection1;
  connection2;
  connection3;
  isHeaterOn = false;
  isPumpOn = false;

  msg: Message[] = [];

  text: any = {
    'Weeks': 'w',
    'Days': 'd', 'Hours': 'h',
    'Minutes': 'm', 'Seconds': 's',
    'MilliSeconds': 'ms'
  };

  static createTempGauge(targetValue: number) {
    return {
      id: 'tempGauge',
      label: 'Temp',
      symbol: '°C',
      min: 0,
      max: 100,
      decimals: 2,
      gaugeWidthScale: 0.6,
      customSectors: [{
        color: '#05a8a8', lo: 0, hi: targetValue - 3
      }, {
        color: '#05a884', lo: targetValue - 3, hi: targetValue - 1
      }, {
        color: '#05a83b', lo: targetValue - 1, hi: targetValue + 1
      }, {
        color: '#a8a505', lo: targetValue + 1, hi: targetValue + 3
      }, {
        color: '#a80705', lo: targetValue + 3, hi: 100
      }],
      counter: true
    };
  }

  static createPhGauge(targetValue: number) {
    return {
      id: 'phGauge',
      label: 'pH',
      min: 1,
      max: 14,
      decimals: 2,
      gaugeWidthScale: 0.6,
      customSectors: [{
        color: '#a80705', lo: 1, hi: targetValue - 2
      }, {
        color: '#a8a505', lo: targetValue - 2, hi: targetValue - 1
      }, {
        color: '#05a83b', lo: targetValue - 1, hi: targetValue + 1
      }, {
        color: '#05a884', lo: targetValue + 1, hi: targetValue + 2
      }, {
        color: '#05a8a8', lo: targetValue + 2, hi: 14
      }],
      counter: true
    };
  }

  static setupJob(job: JobDO, currentJob: JobDateDO) {
    const date1 = new Date();
    date1.setTime(job.jobStartDate);
    currentJob.jobStartDate = date1;
    const date2 = new Date();
    date2.setTime(job.jobEndDate);
    currentJob.jobEndDate = date2;
    currentJob.jobDescription = job.jobDescription;
    currentJob.heaterValue = job.heaterValue;
    currentJob.tempReadInt = job.tempReadInt;
    currentJob.pumpValue = job.pumpValue;
    currentJob.phReadInt = job.phReadInt;
  }

  constructor(private tempService: TempService,
              private devicesService: DevicesService,
              private phService: PhService,
              private jobService: JobService,
              private dialogService: DialogService,
              private deviceService: DeviceService) {
  }

  ngOnDestroy(): void {
    clearInterval(this.tempTimer);
    clearInterval(this.phTimer);
    clearInterval(this.progressBarTimer);
    this.connection1.unsubscribe();
    this.connection2.unsubscribe();
    this.connection3.unsubscribe();
  }

  ngOnInit(): void {
    this.devicesService.getDevices().subscribe(tmpdevices => {
        console.log("-----devices -- " + tmpdevices);
        this.devices = tmpdevices;
        this.startWorking();
      },
      error => {
        console.log(error);
      });

    
  }

  startWorking()
  {
    this.selected = this.devices[0].deviceid;

    this.connection1 = this.tempService.getHeaterStatus().subscribe(response => {
      response ? console.log('Heater turned on') : console.log('Heater turned off');
      this.isHeaterOn = response;
    });
    this.connection2 = this.phService.getPumpStatus().subscribe(response => {
      response ? console.log('Pump turned on') : console.log('Pump turned off');
      this.isPumpOn = response;
    });
    this.connection3 = this.deviceService.getDeviceStatusChanges().subscribe(response => {
      this.msg = [];
      this.toggleChecked = response
      this.toggleSync();
      this.deviceConnected = response;
      response ? this.msg = [{severity: 'success', summary: 'Device', detail: 'Pi connected'}]
        :this.msg = [{severity: 'error', summary: 'Device', detail: 'Pi disconnected'}];
    });

    this.jobService.getJob()
      .subscribe(job => {
        ExperimentComponent.setupJob(job, this.currentJob);
        this.optionsTempGauge = ExperimentComponent.createTempGauge(this.currentJob.heaterValue);
        this.optionsPHGauge = ExperimentComponent.createPhGauge(this.currentJob.pumpValue);
        if (this.currentJob.jobEndDate < (new Date())) {
          this.countdownDate = null;
        } else {
          this.countdownDate = this.currentJob.jobEndDate;
        }
        this.calculateProgBarValue();
        this.progressBarTimer = setInterval(() => {
          this.calculateProgBarValue();
          console.log('progressbar updated');
        }, 10000);
        this.startSync();
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

  selectChanged() {
    console.log(this.selected);
  }

  getTemp() {
    this.tempTimer = setInterval(() => {
      if (!this.toggleChecked || !this.countdownDate) {
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
    }, this.currentJob.tempReadInt * 1000);
  }

  getPh() {
    this.phTimer = setInterval(() => {
      if (!this.toggleChecked || !this.countdownDate) {
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
    }, this.currentJob.phReadInt * 1000);
  }


  openTempSettings() {

    this.dialogService.openSettings(this.currentJob.tempReadInt, this.currentJob.heaterValue).subscribe(res => {
      if (res != null) {

        this.tempService.setReadInterval(res[0])
          .subscribe(result1 => {
            this.currentJob.tempReadInt = result1.sensorSetValue;

            this.tempService.setHeaterTemp(res[1])
              .subscribe(result2 => {
                this.currentJob.heaterValue = result2.sensorSetValue;
                this.optionsTempGauge = ExperimentComponent.createTempGauge(result2.sensorSetValue);
              });
          });
      }
    });
  }

  openPhSettings() {
    this.dialogService.openSettings(this.currentJob.phReadInt, this.currentJob.pumpValue).subscribe(res => {

      if (res != null) {

        this.phService.setReadInterval(res[0])
          .subscribe(result1 => {
            this.currentJob.phReadInt = result1.sensorSetValue;

            this.phService.setPhValue(res[1])
              .subscribe(result2 => {
                this.currentJob.pumpValue = result2.sensorSetValue;
                this.optionsPHGauge = ExperimentComponent.createPhGauge(result2.sensorSetValue);
              });
          });
      }
    });
  }


  checkJob() {
    if ((new Date()) < this.currentJob.jobEndDate) {
      this.dialogService.openConfirmation('There is an another job going on, do you want to start a new one?').subscribe(response => {
        if (response) {
          this.openNewJob();
        }
      });
    } else {
      this.openNewJob();
    }
  }

  stopJob() {
    this.dialogService.openConfirmation('There is a job going on, do you want to stop it?').subscribe(response => {
      if (response) {
        this.jobService.stopJob().subscribe(newJob => {
          ExperimentComponent.setupJob(newJob, this.currentJob);
          this.countdownDate = new Date();
          this.countdownDate = null;
          this.calculateProgBarValue();
        });
      }
    });
  }

  openNewJob() {
    this.dialogService.openNewJob()
      .subscribe(res => {
        console.log(res);
        if ((res[0]) != null) {
          this.jobService.setJob(new JobDO(new Date().getTime(), res[0].getTime(), res[1],
            this.currentJob.heaterValue, this.currentJob.tempReadInt, this.currentJob.pumpValue, this.currentJob.phReadInt))
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
      this.countdownDate = null;
    }
  }
}
