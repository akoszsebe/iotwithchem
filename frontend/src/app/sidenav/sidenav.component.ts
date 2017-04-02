import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  name = '';

  constructor(private authService: AuthService) {
    console.log('constructor');
  }

  ngOnInit() {
    console.log('init');
    this.authService.checkAuthentication().subscribe(user => {
      if (user !== null && user !== undefined) {
        this.name = this.authService.getUser().name;
      }
    });
  }
}
