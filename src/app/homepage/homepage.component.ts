import { Component, OnInit } from '@angular/core';
import { Angular2TokenService, UserData, UserType } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { LoginComponent } from '../authentication/login/login.component';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})


export class HomepageComponent implements OnInit {
  user: UserData = <UserData>{};
  userType: string;

  constructor (
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    if(this.isLoggedIn()) {
      this.tokenService.validateToken().subscribe(
        res => {
          this.user = this.tokenService.currentUserData;
          this.userType = this.tokenService.currentUserType;
          console.log(this.tokenService.currentUserData);
        },
        err => {
          console.log(err);
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
        res => { console.log('User signed out successfully'); },
        err => { console.log(err); }
      );
  }
}