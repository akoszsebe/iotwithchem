import {inject, TestBed} from "@angular/core/testing";
import {PhService} from "./ph.service";
import {HttpModule} from "@angular/http";

describe('PhService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhService],
      imports: [HttpModule]
    });
  });

  it('should ...', inject([PhService], (service: PhService) => {
    expect(service).toBeTruthy();
  }));
});
