import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { Angular2TokenService } from 'angular2-token';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  today: Date = new Date();

  public currentPath: string = "";

  @ViewChild('authDialog') authDialog: AuthDialogComponent;

  constructor(
    private router: Router,
    public tokenAuthService:Angular2TokenService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.currentPath = this.router.url;
    });
  }

  presentAuthDialog(mode?: 'login'| 'register'){
    this.authDialog.openDialog(mode);
  }
  onServicesPage() {
    return this.currentPath.indexOf('/services') !== -1;
  }
  onNewsPage() {
    return this.currentPath.indexOf('/news') !== -1;
  }
}