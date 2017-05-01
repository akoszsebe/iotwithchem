import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SidenavComponent} from './sidenav.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from '../services/auth/auth.service';
import {CustomMdModule} from '../../custom-md/custom-md.module';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavComponent],
      imports: [CustomMdModule, RouterTestingModule],
      providers: [AuthService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
