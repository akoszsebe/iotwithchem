import {inject, TestBed} from '@angular/core/testing';
import {DialogService} from './dialog.service';
import {CustomMdModule} from '../../../custom-md/custom-md.module';

describe('DialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogService],
      imports: [CustomMdModule]
    });
  });

  it('should ...', inject([DialogService], (service: DialogService) => {
    expect(service).toBeTruthy();
  }));
});
