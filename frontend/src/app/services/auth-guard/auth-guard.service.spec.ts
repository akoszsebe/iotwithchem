import {inject, TestBed} from '@angular/core/testing';
import {AuthGuardService} from './auth-guard.service';
import {AuthService} from '../auth/auth.service';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [AuthGuardService, AuthService],
      imports: [HttpModule, FormsModule, MaterialModule.forRoot(), RouterTestingModule]
    });
  });

  it('should ...', inject([AuthGuardService], (service: AuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
