import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {FeedbackComponent} from "./feedback.component";
import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {FeedbackService} from "../services/feedback/feedback.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackComponent],
      imports: [MaterialModule.forRoot(), FormsModule, BrowserAnimationsModule],
      providers: [FeedbackService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
