import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {UserDO} from '../model/user';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  user: UserDO = new UserDO('', '', '', '');
  loggedIn: boolean = false;

  constructor(private authService: AuthService) {
    console.log('constructor');
  }

  ngOnInit() {
    console.log('init');
    this.authService.checkAuthentication().subscribe(user => {
      if (user !== null && user !== undefined) {
        this.user = this.authService.getUser();
        this.loggedIn = true;
      }
    });
  }
}
