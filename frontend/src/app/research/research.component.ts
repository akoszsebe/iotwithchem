import {Component, OnDestroy, OnInit} from "@angular/core";
import {TempService} from "../temp/temp.service";
import {DialogService} from "../dialog/dialog.service";
import {PhService} from "../ph/ph.service";
import {JobService} from "../job/job.service";
import {JobDO} from "../model/job";


@Component({
  selector: 'app-root',
  templateUrl: 'research.component.html',
  styleUrls: ['research.component.css']
})
export class ResearchComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    clearInterval(this.tempTimer);
    clearInterval(this.phTimer);
    clearInterval(this.progressBarTimer);
  }

  constructor(private tempService: TempService,
              private phService: PhService,
              private jobService: JobService,
              private dialogService: DialogService) {
  }


  progressBarTimer: any;

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
        this.jobStartDate = new Date();
        this.jobStartDate.setTime(job.jobStartDate);
        this.jobEndDate = new Date();
        this.jobEndDate.setTime(job.jobEndDate);
        this.jobDescription = job.jobDescription;
        this.calculateProgBarValue();
        this.progressBarTimer = setInterval(() => {
          this.calculateProgBarValue();
          console.log("progressbar updated");
        }, 30000);
      });

  }

  optionsTempGauge = {
    id: "tempGauge",
    label: "Temp",
    symbol: "°C",
    min: 0,
    max: 100,
    decimals: 3,
    gaugeWidthScale: 0.6,
    customSectors: [],
    counter: true
  };
  optionsPHGauge = {
    id: "phGauge",
    label: "pH",
    min: 1,
    max: 14,
    decimals: 3,
    gaugeWidthScale: 0.6,
    customSectors: [],
    counter: true
  };


  maxTemp = 100;
  tempReadInt = 3;
  tempReadValue = 0;
  tempSetValue: number;

  maxPH = 14;
  phReadInt = 3;
  phSetValue = 1;
  phReadValue = 1;

  jobStartDate: Date;
  jobEndDate: Date;
  jobDescription: string;


  syncLabel: string = "Sync is on";
  toggleChecked: boolean;

  toggleSync() {
    console.log(this.toggleChecked);
    if (this.toggleChecked) {
      this.syncLabel = "Sync is on";
    } else {
      this.syncLabel = "Sync is off";
    }
  }

  startSync() {
    this.getTemp();
    this.getPh();
  }

  tempTimer: any;

  getTemp() {
    this.tempTimer = setInterval(() => {
      if (!this.toggleChecked) return;
      this.tempService.getTemp()
        .subscribe(temp => {
            this.temp = temp;
            this.tempReadValue = temp.tempvalue;
            console.log(temp);
          },
          error => {
            console.log(error);
          });
    }, this.tempReadInt * 1000);
  }

  phTimer: any;

  getPh() {
    this.phTimer = setInterval(() => {
      if (!this.toggleChecked) return;
      this.phService.getPh()
        .subscribe(ph => {
            this.ph = ph;
            this.phReadValue = ph.phvalue;
            console.log(ph);
          },
          error => {
            console.log(error);
          });
    }, this.phReadInt * 1000);
  }


  temp: any;
  ph: any;


  openTempSettings() {

    this.dialogService.openSettings(this.tempReadInt, this.tempSetValue).subscribe(res => {
      if (res != null) {

        this.tempReadInt = res[0];

        this.optionsTempGauge = {
          id: "tempGauge",
          label: "Temp",
          symbol: "°C",
          min: 0,
          max: 100,
          decimals: 3,
          gaugeWidthScale: 0.6,
          customSectors: [{
            color: "#ff0000", lo: 0, hi: this.tempSetValue - 3
          }, {
            color: "#ffd50e", lo: this.tempSetValue - 3, hi: this.tempSetValue - 1
          }, {
            color: "#00ff00", lo: this.tempSetValue - 1, hi: this.tempSetValue + 1
          }, {
            color: "#ffd50e", lo: this.tempSetValue + 1, hi: this.tempSetValue + 3
          }, {
            color: "#ff0000", lo: this.tempSetValue + 3, hi: 100
          }],
          counter: true
        };
        this.tempService.setReadInterval(res[0] * 1000)
          .subscribe(result => {
            console.log(result)
          });
        this.tempService.setHeaterTemp(res[1])
          .subscribe(result => {
            this.tempSetValue = result.heatertemperature;
            console.log(res)
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
          id: "phGauge",
          label: "pH",
          min: 1,
          max: 14,
          decimals: 3,
          gaugeWidthScale: 0.6,
          customSectors: [{
            color: "#ff0000", lo: 1, hi: this.phSetValue - 2
          }, {
            color: "#ffd50e", lo: this.phSetValue - 2, hi: this.phSetValue - 0.5
          }, {
            color: "#00ff00", lo: this.phSetValue - 0.5, hi: this.phSetValue + 0.5
          }, {
            color: "#ffd50e", lo: this.phSetValue + 0.5, hi: this.phSetValue + 2
          }, {
            color: "#ff1105", lo: this.phSetValue + 2, hi: 14
          }],
          counter: true
        };
        console.log(res)
      }
    });
  }

  openNewJob() {
    this.dialogService.openNewJob()
      .subscribe(res => {
        console.log(res);
        if ((res[0]) != null) {
          this.jobService.setJob(new JobDO(new Date().getTime(), res[0].getTime(), res[1]))
            .subscribe(newJob => {
              let date1 = new Date();
              date1.setTime(newJob.jobStartDate);
              this.jobStartDate = date1;
              let date2 = new Date();
              date2.setTime(newJob.jobEndDate);
              this.jobEndDate = date2;
              this.jobDescription = newJob.jobDescription;
              this.calculateProgBarValue()
            })

        }
      });
  }

  progressBarValue: number;

  calculateProgBarValue() {

    this.progressBarValue = parseFloat((((new Date().getTime()) - this.jobStartDate.getTime() ) * 100
    / (this.jobEndDate.getTime() - this.jobStartDate.getTime())).toFixed(3));
  }

  text: any = {
    "Weeks": "w",
    "Days": "d", "Hours": "h",
    "Minutes": "m", "Seconds": "s",
    "MilliSeconds": "ms"
  };
}
