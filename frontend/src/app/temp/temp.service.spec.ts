import {inject, TestBed} from "@angular/core/testing";
import {TempService} from "./temp.service";

describe('TempService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TempService]
    });
  });

  it('should ...', inject([TempService], (service: TempService) => {
    expect(service).toBeTruthy();
  }));
});
