import {inject, TestBed} from "@angular/core/testing";
import {TempService} from "./temp.service";
import {HttpModule} from "@angular/http";

describe('TempService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TempService],
      imports: [HttpModule]
    });
  });

  it('should ...', inject([TempService], (service: TempService) => {
    expect(service).toBeTruthy();
  }));
});
