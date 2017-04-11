import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {LoginComponent} from "./login.component";
import {MaterialModule} from "@angular/material";
import {AuthService} from "../services/auth/auth.service";
import {FormsModule} from "@angular/forms";
import {ProgressBarModule} from "primeng/primeng";
import {RouterTestingModule} from "@angular/router/testing";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [MaterialModule.forRoot(), RouterTestingModule, FormsModule, ProgressBarModule],
      providers: [AuthService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
