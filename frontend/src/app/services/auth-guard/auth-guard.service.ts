import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs/observable';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private  authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): Observable<boolean> {
    /*console.log(this.authService.isLoggedIn());*/

    return this.authService.checkAuthentication().map(user => {
      if (url === '/login') {

        return !user;
      } else {
        if (user) {
          return true;
        }
        this.authService.redirectUrl = url;
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
