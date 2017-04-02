import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  name = '';

  constructor(authService: AuthService) {
    console.log('constructor');
    console.log(authService.getUser());
    this.name = authService.getUser().name;
  }

  ngOnInit() {
    console.log('init');
  }

}
