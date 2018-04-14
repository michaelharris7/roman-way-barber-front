import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from 'angular2-token';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'auth-links',
  template: `
    <div class="form-group"
        [class.nav-styles]=!isNewLayout()
        [class.nav-styles-new]=isNewLayout()>
      <div class="nav" [class.nav-new]=isNewLayout()>

        <div class="nav-item">
          <a class="nav-link nav-link-new nav-account" routerLink="/register" routerLinkActive="active" *ngIf="isLoggedOut()">Register</a>
        </div>

        <div class="nav-item">
          <a class="nav-link nav-link-new nav-account" type="submit" routerLink="/login" routerLinkActive="active" *ngIf="isLoggedOut()">Login</a>
        </div>

        <div class="nav-item">
          <a class="nav-link nav-link-new nav-account" type="submit" (click)="logOut()" *ngIf="isLoggedIn()">Logout</a>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./auth-links.component.css']
})

export class AuthLinksComponent {
  public currentPath: string = "";

  constructor(
    private _tokenService: Angular2TokenService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.currentPath = this.router.url;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isLoggedOut(): boolean {
    return !this.authService.isLoggedIn();
  }

  // onSubmit() {
  //   this._tokenService.signOut().subscribe(
  //       res =>      console.log(res),
  //       error =>    console.log(error)
  //   );
  // }


  logOut() {
    this.authService.logOut().subscribe(
        data => { return true },
        error => {
          console.log("Error logging out");
          return Observable.throw(error);
        }
      );
  }

  // .subscribe(
  //         data => { return true },
  //         error => {
  //           console.log("Error saving user");
  //           return Observable.throw(error);
  //         }
  //       );


  // LogOut(): void {
  //   this.authService.logOut();
  // }


  isNewLayout() {
    switch (this.currentPath)
    {
    // On a standard page
    case'/':
    case'/home':
    case'/services':
    case'/services/haircut':
    case'/services/shave':
    case'/services/trim':
    case'/about':
    case'/contact':
      return false;
    case'/signup':
    default:
      return true;
    }
  }
}