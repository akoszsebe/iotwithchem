import {inject, TestBed} from '@angular/core/testing';
import {DialogService} from './dialog.service';
import {MaterialModule} from '@angular/material';

describe('DialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogService],
      imports: [MaterialModule.forRoot()]
    });
  });

  it('should ...', inject([DialogService], (service: DialogService) => {
    expect(service).toBeTruthy();
  }));
});
