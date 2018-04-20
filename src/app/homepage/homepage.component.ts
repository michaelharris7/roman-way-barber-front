import { Component } from '@angular/core';
import { Angular2TokenService, UserData, UserType } from 'angular2-token';
import { AuthenticationService } from '../authentication/authentication.service';
import { LoginComponent } from '../authentication/login/login.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent {
  // userType: UserType = <UserType>{};
  // userType: string;
  // user: UserData = <UserData>{};
  // user: any;

  constructor (
    // private tokenService: Angular2TokenService,
    // private authService: AuthenticationService
  ) {}

  // ngOnInit() {
  //   this.userType = this.tokenService.currentUserType;
  //   this.user = this.tokenService.currentUserData;
  //   console.log(this.tokenService.currentUserData);

  //   this.tokenService.validateToken().subscribe(res => {
  //     console.log(this.tokenService.currentUserData);
  //   });
  //   // this.user = this.authService.findProfile;
  // }
}


