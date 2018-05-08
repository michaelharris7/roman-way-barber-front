import { Component, OnInit } from '@angular/core';
import { Angular2TokenService, UserData, UserType } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})


export class HomepageComponent implements OnInit {
  userData: UserData = <UserData>{};
  userType: string;

  constructor (
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.loginVerification();
  }


  // Account Functions
  loginVerification() {
    if(this.isLoggedIn()) {
      this.tokenService.validateToken().subscribe(
        res => {
          this.userData = this.tokenService.currentUserData;
          this.userType = this.tokenService.currentUserType;
        },
        err => {
          console.log('No user logged in. Logging out:' + err);
          this.logOut();
        }
      );
    }
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logOut() {
    this.authService.logOut().subscribe(
        res => { return true },
        err => { console.log('There was an error in logging out:' + err); }
      );
  }
}