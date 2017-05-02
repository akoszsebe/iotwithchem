export class JobDateDO {

  constructor(public jobStartDate: Date,
              public jobEndDate: Date,
              public jobDescription: string,
              public heaterValue: number,
              public tempReadInt: number,
              public pumpValue: number,
              public phReadInt: number) {
  }
}
