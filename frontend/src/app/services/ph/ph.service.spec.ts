import {inject, TestBed} from '@angular/core/testing';
import {PhService} from './ph.service';

describe('PhService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhService]
    });
  });

  it('should ...', inject([PhService], (service: PhService) => {
    expect(service).toBeTruthy();
  }));
});
