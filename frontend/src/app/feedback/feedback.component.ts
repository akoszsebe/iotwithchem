import {Component, OnInit} from "@angular/core";
import {FeedbackService} from "./feedback.service";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  from: string;
  message: string;
  response: string;

  constructor(private feedbackService: FeedbackService) {
  }

  ngOnInit() {
  }

  sendFeedback() {
    this.feedbackService.sendFeedback(this.from, this.message).subscribe(res =>{
      if (res){
        this.response = "Thank you for your feedback";
        this.from = "";
        this.message = "";
      }else{
        this.response = "Something went wrong, please try again"
      }
    });
  }

}
