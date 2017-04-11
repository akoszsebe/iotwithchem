import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {SidenavComponent} from "./sidenav.component";
import {MaterialModule} from "@angular/material";
import {RouterTestingModule} from "@angular/router/testing";
import {AuthService} from "../services/auth/auth.service";

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavComponent],
      imports: [MaterialModule.forRoot(), RouterTestingModule],
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
