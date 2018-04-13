import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'auth-links',
  template: `
    <div class="form-group">
      <div class="nav-account" [class.nav-styles]=notOnNewsPage() [class.nav-styles-news]=onNewsPage()>
        <a class="nav-link" routerLink="/signup" routerLinkActive="active" *ngIf="isLoggedOut()">Register</a>
      </div>
      <div class="nav-account" [class.nav-styles]=notOnNewsPage() [class.nav-styles-news]=onNewsPage()>
        <a class="nav-link" type="submit" routerLink="/login" routerLinkActive="active" *ngIf="isLoggedOut()">Login</a>
      </div>
      <div class="nav-account" [class.nav-styles]=notOnNewsPage() [class.nav-styles-news]=onNewsPage()>
        <a class="nav-link" type="submit" routerLink="/logout" (click)="logOut()" *ngIf="isLoggedIn()">Logout</a>
      </div>
    </div>
  `,
  styleUrls: ['./auth-links.component.css']
})

export class AuthLinksComponent {
  public currentPath: string = "";

  constructor(
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

  LogOut(): void {
    this.authService.logOut();
  }


  notOnNewsPage() {
    return this.currentPath.indexOf('/news') == -1;
  }
  onNewsPage() {
    return this.currentPath.indexOf('/news') !== -1;
  }
}