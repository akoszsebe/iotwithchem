export class JobDO {

  constructor(public jobStartDate: number,
              public jobEndDate: number,
              public jobDescription: string,
              public heaterValue: number,
              public tempReadInt: number,
              public pumpValue: number,
              public phReadInt: number) {
  }
}
