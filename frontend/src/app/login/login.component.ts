import {Component} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  message: string;

  constructor(public authService: AuthService, public router: Router) {
    this.setMessage();
  }

  setMessage() {
    this.message = 'Logged' + (this.authService.isLoggedIn ? 'in' : 'out');
  }

  // login() {
  //   this.message = 'Trying to log in...';
  //
  //   // this.authService.checkAuthentication().subscribe(user => console.log(user));
  //
  //   this.authService.login().subscribe(() => {
  //     this.setMessage();
  //     if (this.authService.isLoggedIn) {
  //
  //       let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/research';
  //
  //       this.router.navigate([redirect]);
  //     }
  //   })
  //}


  logout() {
    this.authService.logout();
    this.setMessage();
  }


}
