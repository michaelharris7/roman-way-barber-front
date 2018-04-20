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
  userReset: boolean = false;

  constructor (
    private tokenService: Angular2TokenService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.user = this.tokenService.currentUserData;
    this.userType = this.tokenService.currentUserType;
    console.log(this.tokenService.currentUserData);
  }


  refreshUser() {
    if(this.isLoggedIn() && !this.userReset) {
      this.tokenService.validateToken().subscribe(
        res => {console.log(res);},
        err => {console.log(err);}
      );
      this.userReset = true;
    }
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}